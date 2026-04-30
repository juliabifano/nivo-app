import { useState, useEffect } from "react";
import { createCategory } from "../core/categories/categoryFactory";

export function useCategoryStore() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("categories");
    if (saved) {
      setCategories(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  function add(raw) {
    const nova = createCategory(raw);

    setCategories((prev) => [...prev, nova]);

    return nova;
  }
  function remove(id) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return {
    categories,
    add,
    remove,
  };
}
