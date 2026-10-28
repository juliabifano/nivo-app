import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { useAccounts } from "./AccountContext";
import { useCategories } from "./CategoryContext";
import { useCards } from "./CardContext";
import { useTransactions } from "./TransactionContext";
import { useBudgetAnnual } from "./BudgetAnnualContext";
import { getOnboardingState, persistOnboardingStatus } from "../core/onboarding";
import { supabase } from "../lib/supabase";

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const accountsStore = useAccounts();
  const categoriesStore = useCategories();
  const cardsStore = useCards();
  const transactionsStore = useTransactions();
  const budgetStore = useBudgetAnnual();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const attemptedCompletion = useRef(false);
  const pendingStatus = useRef(null);
  const requestInFlight = useRef(false);
  const status = user?.user_metadata?.nivo_onboarding_status;
  const loading = authLoading || [accountsStore, categoriesStore, cardsStore, transactionsStore, budgetStore]
    .some((store) => store.loading);
  const state = getOnboardingState({
    status,
    loading,
    accounts: accountsStore.accounts,
    categories: categoriesStore.categories,
    cards: cardsStore.cards,
    transactions: transactionsStore.transactions,
    items: budgetStore.items,
  });

  const saveStatus = useCallback(async (nextStatus) => {
    if (!user?.id || requestInFlight.current) return false;
    requestInFlight.current = true;
    pendingStatus.current = nextStatus;
    setSaving(true);
    setError("");
    try {
      await persistOnboardingStatus(supabase.auth, nextStatus);
      return true;
    } catch {
      setError("Não foi possível salvar sua configuração inicial. Tente novamente.");
      return false;
    } finally {
      requestInFlight.current = false;
      setSaving(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (loading || !user || !state.allStepsCompleted || status === "completed" || status === "skipped" || attemptedCompletion.current) return;
    attemptedCompletion.current = true;
    void saveStatus("completed");
  }, [loading, user, state.allStepsCompleted, status, saveStatus]);

  return (
    <OnboardingContext.Provider value={{ ...state, loading, saving, saveStatus }}>
      {children}
      {error && (
        <div role="alert" className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-lg rounded-2xl bg-slate-900 p-4 text-white shadow-xl">
          <p>{error}</p>
          <button disabled={saving} onClick={() => saveStatus(pendingStatus.current)} className="mt-2 underline disabled:opacity-50">
            {saving ? "Salvando…" : "Tentar novamente"}
          </button>
        </div>
      )}
    </OnboardingContext.Provider>
  );
}

// Mantém o padrão dos outros contexts do projeto, que também exportam seu hook.
// eslint-disable-next-line react-refresh/only-export-components
export function useOnboarding() {
  return useContext(OnboardingContext);
}
