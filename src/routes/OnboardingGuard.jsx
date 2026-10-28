import { Navigate, useLocation } from "react-router-dom";
import { useAccounts } from "../contexts/AccountContext";
import { useCards } from "../contexts/CardContext";
import { useTransactions } from "../contexts/TransactionContext";
import { useBudgetAnnual } from "../contexts/BudgetAnnualContext";
import { useCategories } from "../contexts/CategoryContext";

export default function OnboardingGuard({ children }) {
  const location = useLocation();

  const { accounts = [] } = useAccounts();
  const { cards = [] } = useCards();
  const { transactions = [] } = useTransactions();
  const { items = [] } = useBudgetAnnual();
  const { categories = [] } = useCategories();

  const allowedEmptyRoutes = [
    "/onboarding",
    "/accounts",
    "/categories",
    "/cards",
  ];

  const hasAnyData =
    accounts.length > 0 ||
    cards.length > 0 ||
    transactions.length > 0 ||
    items.length > 0 ||
    categories.length > 0;

  const onboardingSkipped =
    localStorage.getItem("nivo-onboarding-skipped") === "true";

  if (
    !hasAnyData &&
    !onboardingSkipped &&
    !allowedEmptyRoutes.includes(location.pathname)
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
