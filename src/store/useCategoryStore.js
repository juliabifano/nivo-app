import { useState, useEffect } from "react";
import { createCategory } from "../core/categories/categoryFactory";
import {
  getCategories,
  createCategory as createCategoryRepo,
  deleteCategory,
} from "../repositories/categoryRepository";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export function useCategoryStore() {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // LOAD
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    async function load() {
      const data = await getCategories(user.id);

      setCategories(data || []);
      setLoading(false);
    }

    load();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("categories-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
        },
        async () => {
          const data = await getCategories(user.id);
          setCategories(data || []);
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

    const nova = createCategory(raw);

    const saved = await createCategoryRepo({
      ...nova,
      user_id: user.id,
    });

    if (!saved) return null;

    setCategories((prev) => [saved, ...prev]);

    return saved;
  }

  // -----------------------------
  // REMOVE
  // -----------------------------
  async function remove(id) {
    await deleteCategory(id);

    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return {
    loading: !!user && loading,
    categories,
    add,
    remove,
  };
}
