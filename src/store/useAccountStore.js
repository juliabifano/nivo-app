import { useState, useEffect } from "react";
import { createAccount } from "../core/accounts/accountFactory";
import {
  getAccounts,
  createAccount as createAccountRepo,
  updateAccount,
  deleteAccount,
} from "../repositories/accountRepository";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export function useAccountStore() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const data = await getAccounts(user.id);
      setAccounts(data || []);
      setLoading(false);
    }

    load();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("accounts-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "accounts",
        },
        async () => {
          const data = await getAccounts(user.id);
          setAccounts(data || []);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  async function add(raw) {
    if (!user) return null;

    const nova = createAccount(raw);

    const saved = await createAccountRepo({
      ...nova,
      user_id: user.id,
    });

    if (!saved) return null;

    setAccounts((prev) => [saved, ...prev]);
    return saved;
  }

  async function update(id, data) {
    const saved = await updateAccount(id, data);

    if (!saved) return;

    setAccounts((prev) => prev.map((a) => (a.id === id ? saved : a)));
  }

  async function remove(id) {
    await deleteAccount(id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  return {
    loading: !!user && loading,
    accounts,
    add,
    update,
    remove,
  };
}
