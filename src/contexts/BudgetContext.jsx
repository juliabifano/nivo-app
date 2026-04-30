import { createContext, useContext, useEffect, useState } from "react";
import {
  normalizeTransaction,
  normalizeCard,
  normalizeItem,
} from "../finance/normalize";

const BudgetContext = createContext();

const load = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export function BudgetProvider({ children }) {
  // =========================
  // STATE (já normalizado na entrada)
  // =========================

  const [transactions, setTransactions] = useState(() =>
    load("nivo-transactions", []).map(normalizeTransaction),
  );

  const [cartoes, setCartoes] = useState(() =>
    load("nivo-cartoes", []).map(normalizeCard),
  );

  const [accounts, setAccounts] = useState(() =>
    load("accounts", []),
  );

  const [categorias, setCategorias] = useState(() =>
    load("nivo-categorias", []),
  );

  const [items, setItems] = useState(() =>
    load("nivo-items", []).map(normalizeItem),
  );

  const [faturas, setFaturas] = useState(() =>
    load("nivo-faturas", []),
  );

  // =========================
  // PERSISTÊNCIA (salva já normalizado)
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "nivo-transactions",
      JSON.stringify(transactions),
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(
      "nivo-cartoes",
      JSON.stringify(cartoes),
    );
  }, [cartoes]);

  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(
      "nivo-categorias",
      JSON.stringify(categorias),
    );
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem("nivo-items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("nivo-faturas", JSON.stringify(faturas));
  }, [faturas]);

  // =========================
  // CRUD TRANSAÇÕES (AGORA NORMALIZADO)
  // =========================

  function addTransaction(tx) {
    const normalized = normalizeTransaction(tx);

    setTransactions((prev) => [...prev, normalized]);
  }

  function updateTransaction(id, data) {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? normalizeTransaction({ ...t, ...data })
          : t,
      ),
    );
  }

  function deleteTransaction(id) {
    setTransactions((prev) =>
      prev.filter((t) => t.id !== id),
    );
  }

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        setTransactions,

        cartoes,
        setCartoes,

        accounts,
        setAccounts,

        categorias,
        setCategorias,

        items,
        setItems,

        faturas,
        setFaturas,

        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  return useContext(BudgetContext);
}