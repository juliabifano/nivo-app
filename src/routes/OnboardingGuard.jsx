import { Navigate, useLocation } from "react-router-dom";
import { useOnboarding } from "../contexts/OnboardingContext";

export default function OnboardingGuard({ children }) {
  const location = useLocation();

  const { loading, needsWelcome } = useOnboarding();

  if (loading) return <div role="status" className="p-6 text-center">Carregando seus dados…</div>;

  const allowedEmptyRoutes = [
    "/onboarding",
    "/accounts",
    "/categories",
    "/cards",
  ];

  if (
    needsWelcome &&
    !allowedEmptyRoutes.includes(location.pathname)
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
