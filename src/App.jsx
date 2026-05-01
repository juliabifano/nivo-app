import AppRoutes from "./routes";

import { TransactionProvider } from "./contexts/TransactionContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { CardProvider } from "./contexts/CardContext";
import { BudgetAnnualProvider } from "./contexts/BudgetAnnualContext";
import { AccountProvider } from "./contexts/AccountContext";
import { PaymentScheduleProvider } from "./contexts/PaymentScheduleContext";

export default function App() {
  return (
    <CategoryProvider>
      <TransactionProvider>
        <CardProvider>
          <BudgetAnnualProvider>
            <AccountProvider>
              <PaymentScheduleProvider>
                <AppRoutes />
              </PaymentScheduleProvider>
            </AccountProvider>
          </BudgetAnnualProvider>
        </CardProvider>
      </TransactionProvider>
    </CategoryProvider>
  );
}
