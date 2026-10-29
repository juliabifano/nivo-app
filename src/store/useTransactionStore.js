import { useState, useEffect } from "react";
import { createTransaction } from "../core/transactions/transactionFactory";
import {
  getTransactions,
  createTransaction as createTransactionRepo,
  deleteTransaction,
  deleteSchedulePaymentTransactions,
  updateTransaction,
} from "../repositories/transactionRepository";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { isSchedulePayment } from "../core/transactions/schedulePayment";

export function useTransactionStore() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // LOAD
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    async function load() {
      const data = await getTransactions(user.id);

      setTransactions(data || []);
      setLoading(false);
    }

    load();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("transactions-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        async () => {
          const data = await getTransactions(user.id);

          setTransactions(data || []);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // -----------------------------
  // ADD
  // -----------------------------
  async function add(raw) {
    if (!user) return;

    const nova = createTransaction(raw);

    const saved = await createTransactionRepo({
      ...nova,
      user_id: user.id,
    });

    if (!saved) return null;

    setTransactions((prev) => [saved, ...prev.filter((transaction) => transaction.id !== saved.id)]);

    return saved;
  }

  // -----------------------------
  // UPDATE
  // -----------------------------
  async function update(id, data) {
    if (!user) throw new Error("Entre na sua conta para editar um lançamento.");
    const existing = transactions.find((transaction) => transaction.id === id);
    if (!existing) throw new Error("Lançamento não encontrado. Atualize a página e tente novamente.");
    const saved = await updateTransaction(id, createTransaction({ ...existing, ...data }), user.id);
    setTransactions((prev) => prev.map((transaction) => transaction.id === id ? saved : transaction));
    return saved;
  }

  // -----------------------------
  // REMOVE
  // -----------------------------
  async function remove(id) {
    await deleteTransaction(id);

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  return {
    loading: !!user && loading,
    transactions,
    add,
    update,
    remove,
    async removePayment(paymentId) {
      if (!user) throw new Error("Entre na sua conta para alterar um pagamento.");
      const deletedIds = await deleteSchedulePaymentTransactions(user.id, paymentId);
      const linked = transactions.filter((transaction) => isSchedulePayment(transaction, paymentId));
      if (linked.some((transaction) => !deletedIds.includes(transaction.id))) {
        throw new Error("O banco não confirmou a exclusão de todos os lançamentos deste pagamento.");
      }
      setTransactions((prev) => prev.filter((transaction) => !isSchedulePayment(transaction, paymentId)));
    },
  };
}
