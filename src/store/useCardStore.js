import { useState, useEffect } from "react";
import { createCard } from "../core/cards/cardFactory";

const STORAGE_KEY = "cards";

export function useCardStore() {
  const [cards, setCards] = useState([]);

  // 🔥 carregar do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setCards(JSON.parse(saved));
      } catch (err) {
        console.error("Erro ao carregar cartões:", err);
      }
    }
  }, []);

  // 🔥 persistência automática
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  // ➕ adicionar cartão
  function add(raw) {
    const novo = createCard(raw);

    setCards((prev) => [...prev, novo]);

    return novo;
  }

  // ❌ remover cartão
  function remove(id) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  // ✏️ atualizar cartão
  function update(id, data) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, ...data }
          : c
      )
    );
  }

  return {
    cards,
    add,
    remove,
    update,
  };
}