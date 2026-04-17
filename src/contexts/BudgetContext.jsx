import { createContext, useContext, useEffect, useState } from "react";

const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("nivo-budget");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categorias, setCategorias] = useState(() => {
    try {
      const saved = localStorage.getItem("nivo-categorias");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("nivo-transactions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartoes, setCartoes] = useState(() => {
    const saved = localStorage.getItem("nivo-cartoes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("nivo-budget", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("nivo-categorias", JSON.stringify(categorias));
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem("nivo-transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("nivo-cartoes", JSON.stringify(cartoes));
  }, [cartoes]);

  return (
    <BudgetContext.Provider
      value={{
        items,
        setItems,
        categorias,
        setCategorias,
        transactions,
        setTransactions,
        cartoes,
        setCartoes,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  return useContext(BudgetContext);
}
