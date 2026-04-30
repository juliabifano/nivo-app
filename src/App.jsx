import AppRoutes from "./routes";

import { TransactionProvider } from "./contexts/TransactionContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { CardProvider } from "./contexts/CardContext";
import { BudgetAnnualProvider } from "./contexts/BudgetAnnualContext";
import { AccountProvider } from "./contexts/AccountContext";

export default function App() {
  return (
    <CategoryProvider>
      <TransactionProvider>
        <CardProvider>
          <BudgetAnnualProvider>
            <AccountProvider>
              <AppRoutes />
            </AccountProvider>
          </BudgetAnnualProvider>
        </CardProvider>
      </TransactionProvider>
    </CategoryProvider>
  );
}
