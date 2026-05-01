import { useState, useEffect } from "react";
import { createBudgetItem } from "../core/budget/budgetFactory";

const STORAGE_KEY = "budget_items";

export function useBudgetStore() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function add(raw) {
    const novo = createBudgetItem(raw);
    setItems((prev) => [...prev, novo]);
    return novo;
  }

  function update(id, data) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
              valorMensal: Number(data.valorMensal || 0),
              meses: Array.isArray(data.meses) ? data.meses : [],
              diaVencimento: Number(data.diaVencimento || 1),
            }
          : item,
      ),
    );
  }

  function remove(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return {
    items,
    add,
    update,
    remove,
  };
}