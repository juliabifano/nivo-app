import { useState, useEffect } from "react";
import { createAccount } from "../core/accounts/accountFactory";

const STORAGE_KEY = "accounts";

export function useAccountStore() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setAccounts(JSON.parse(saved));
      } catch {
        setAccounts([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  function add(raw) {
    const nova = createAccount(raw);
    setAccounts((prev) => [...prev, nova]);
    return nova;
  }

  function update(id, data) {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a)),
    );
  }

  function remove(id) {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  return {
    accounts,
    add,
    update,
    remove,
  };
}