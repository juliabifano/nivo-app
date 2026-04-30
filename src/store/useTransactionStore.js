import { useState, useEffect } from "react";
import { createTransaction } from "../core/transactions/transactionFactory";

export function useTransactionStore() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  function add(raw) {
    const nova = createTransaction(raw);

    setTransactions((prev) => [...prev, nova]);

    return nova;
  }

  function update(id, data) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
    );
  }

  function remove(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  return {
    transactions,
    add,
    update,
    remove,
  };
}
