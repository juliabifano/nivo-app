import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import BudgetAnnual from "./pages/BudgetAnnual";
import BudgetMonthly from "./pages/BudgetMonthly";
import Transactions from "./pages/Transactions";
import Cards from "./pages/Cards";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/annual" element={<BudgetAnnual />} />
        <Route path="/monthly" element={<BudgetMonthly />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/cards" element={<Cards />} />
      </Route>
    </Routes>
  );
}