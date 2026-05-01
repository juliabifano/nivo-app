import { createContext, useContext } from "react";
import { usePaymentScheduleStore } from "../store/usePaymentScheduleStore";

const PaymentScheduleContext = createContext();

export function PaymentScheduleProvider({ children }) {
  const store = usePaymentScheduleStore();

  return (
    <PaymentScheduleContext.Provider value={store}>
      {children}
    </PaymentScheduleContext.Provider>
  );
}

export function usePaymentSchedule() {
  return useContext(PaymentScheduleContext);
}