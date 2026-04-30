import { createContext, useContext } from "react";
import { useCardStore } from "../store/useCardStore";

const CardContext = createContext();

export function CardProvider({ children }) {
  const store = useCardStore();

  return (
    <CardContext.Provider value={store}>
      {children}
    </CardContext.Provider>
  );
}

// hook padrão
export function useCards() {
  return useContext(CardContext);
}