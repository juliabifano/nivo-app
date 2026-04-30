import { useMemo } from "react";
import { useBudget } from "../contexts/BudgetContext";
import { createFinanceEngine } from "./engine";
import { dataProvider } from "../data/dataProvider";

export function useFinance() {
  const state = useBudget();

  const finance = useMemo(() => {
    return createFinanceEngine({
      ...state,
      repo: dataProvider,
    });
  }, [state]);

  return finance;
}
