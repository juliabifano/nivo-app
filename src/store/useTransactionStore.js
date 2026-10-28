import { useState, useEffect } from "react";
import { createTransaction } from "../core/transactions/transactionFactory";
import {
  getTransactions,
  createTransaction as createTransactionRepo,
  deleteTransaction,
} from "../repositories/transactionRepository";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

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

    setTransactions((prev) => [saved, ...prev]);

    return saved;
  }

  // -----------------------------
  // UPDATE
  // -----------------------------
  function update(id, data) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
    );
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
  };
}
