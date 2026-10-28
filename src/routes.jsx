import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import BudgetAnnual from "./pages/BudgetAnnual";
import BudgetMonthly from "./pages/BudgetMonthly";
import Transactions from "./pages/Transactions";
import Cards from "./pages/Cards";
import Accounts from "./pages/Accounts";
import Schedule from "./pages/Schedule";
import More from "./pages/More";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Onboarding from "./pages/Onboarding";
import OnboardingGuard from "./routes/OnboardingGuard";
import Categories from "./pages/Categories";
import OnboardingComplete from "./pages/OnboardingComplete";

export default function AppRoutes() {
  return (
    <Routes>
      {/* HOME (SEM LAYOUT) */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* APP (COM LAYOUT) */}
      <Route
        element={
          <ProtectedRoute>
            <OnboardingGuard>
              <Layout />
            </OnboardingGuard>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/annual" element={<BudgetAnnual />} />
        <Route path="/monthly" element={<BudgetMonthly />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/more" element={<More />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/categories" element={<Categories />} />
      </Route>
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding-complete"
        element={
          <ProtectedRoute>
            <OnboardingComplete />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
