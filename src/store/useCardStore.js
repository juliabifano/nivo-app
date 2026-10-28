import { useState, useEffect } from "react";
import { createCard } from "../core/cards/cardFactory";
import {
  getCards,
  createCard as createCardRepo,
  updateCard,
  deleteCard,
} from "../repositories/cardRepository";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export function useCardStore() {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const data = await getCards(user.id);
      setCards(data || []);
    }

    load();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("cards-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cards",
        },
        async () => {
          const data = await getCards(user.id);

          setCards(data || []);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  async function add(raw) {
    if (!user) return null;

    const novo = createCard(raw);

    const saved = await createCardRepo({
      ...novo,
      user_id: user.id,
    });

    if (!saved) return null;

    setCards((prev) => [saved, ...prev]);
    return saved;
  }

  async function remove(id) {
    await deleteCard(id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  async function update(id, data) {
    const saved = await updateCard(id, data);

    if (!saved) return;

    setCards((prev) => prev.map((c) => (c.id === id ? saved : c)));
  }

  return {
    cards,
    add,
    remove,
    update,
  };
}
