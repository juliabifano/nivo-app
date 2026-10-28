import AppRoutes from "./routes";

import { TransactionProvider } from "./contexts/TransactionContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { CardProvider } from "./contexts/CardContext";
import { BudgetAnnualProvider } from "./contexts/BudgetAnnualContext";
import { AccountProvider } from "./contexts/AccountContext";
import { PaymentScheduleProvider } from "./contexts/PaymentScheduleContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";

export default function App() {
  return (
    <AuthProvider>
      <UserDataProviders />
    </AuthProvider>
  );
}

function UserDataProviders() {
  const { user } = useAuth();

  return (
    <CategoryProvider key={user?.id ?? "signed-out"}>
      <TransactionProvider>
        <CardProvider>
          <BudgetAnnualProvider>
            <AccountProvider>
              <PaymentScheduleProvider>
                <OnboardingProvider>
                  <AppRoutes />
                </OnboardingProvider>
              </PaymentScheduleProvider>
            </AccountProvider>
          </BudgetAnnualProvider>
        </CardProvider>
      </TransactionProvider>
    </CategoryProvider>
  );
}
