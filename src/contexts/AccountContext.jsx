import { createContext, useContext } from "react";
import { useAccountStore } from "../store/useAccountStore";

const AccountContext = createContext();

export function AccountProvider({ children }) {
  const store = useAccountStore();

  return (
    <AccountContext.Provider value={store}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccounts() {
  return useContext(AccountContext);
}