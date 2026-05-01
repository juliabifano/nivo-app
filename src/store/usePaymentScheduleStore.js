import { useEffect, useState } from "react";

const STORAGE_KEY = "paid_schedule_items";

export function usePaymentScheduleStore() {
  const [paidIds, setPaidIds] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setPaidIds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(paidIds));
  }, [paidIds]);

  function markAsPaid(id) {
    setPaidIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function unmarkAsPaid(id) {
    setPaidIds((prev) => prev.filter((p) => p !== id));
  }

  return {
    paidIds,
    markAsPaid,
    unmarkAsPaid,
  };
}