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

export default function AppRoutes() {
  return (
    <Routes>
      {/* HOME (SEM LAYOUT) */}
      <Route path="/" element={<Home />} />

      {/* APP (COM LAYOUT) */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/annual" element={<BudgetAnnual />} />
        <Route path="/monthly" element={<BudgetMonthly />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/schedule" element={<Schedule />} />
      </Route>
    </Routes>
  );
}