import { createContext, useContext } from "react";
import { useTransactionStore } from "../store/useTransactionStore";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const store = useTransactionStore();

  return (
    <TransactionContext.Provider value={store}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}