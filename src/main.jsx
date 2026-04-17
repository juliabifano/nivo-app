import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { BudgetProvider } from "./contexts/BudgetContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <BudgetProvider>
      <App />
    </BudgetProvider>
  </BrowserRouter>
);