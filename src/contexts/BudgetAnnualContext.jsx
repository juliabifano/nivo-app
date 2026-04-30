import { createContext, useContext } from "react";
import { useBudgetStore } from "../store/useBudgetStore";

const BudgetAnnualContext = createContext();

export function BudgetAnnualProvider({ children }) {
  const store = useBudgetStore();

  return (
    <BudgetAnnualContext.Provider value={store}>
      {children}
    </BudgetAnnualContext.Provider>
  );
}

export function useBudgetAnnual() {
  return useContext(BudgetAnnualContext);
}