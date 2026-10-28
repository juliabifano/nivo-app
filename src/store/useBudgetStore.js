import { useState, useEffect } from "react";
import { createBudgetItem } from "../core/budget/budgetFactory";
import {
  getBudgetItems,
  createBudgetItem as createBudgetItemRepo,
  updateBudgetItem,
  deleteBudgetItem,
} from "../repositories/budgetRepository";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export function useBudgetStore() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);

  // -----------------------------
  // LOAD
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    async function load() {
      const data = await getBudgetItems(user.id);

      setItems(data || []);
    }

    load();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("budget-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "budget_items",
        },
        async () => {
          const data = await getBudgetItems(user.id);

          setItems(data || []);
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
    if (!user) return null;

    const novo = createBudgetItem(raw);

    const saved = await createBudgetItemRepo({
      ...novo,
      user_id: user.id,
    });

    if (!saved) return null;

    setItems((prev) => [saved, ...prev]);

    return saved;
  }

  // -----------------------------
  // UPDATE
  // -----------------------------
  async function update(id, data) {
    const saved = await updateBudgetItem(id, data);

    if (!saved) return;

    setItems((prev) => prev.map((item) => (item.id === id ? saved : item)));
  }

  // -----------------------------
  // REMOVE
  // -----------------------------
  async function remove(id) {
    await deleteBudgetItem(id);

    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return {
    items,
    add,
    update,
    remove,
  };
}
