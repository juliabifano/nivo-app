import { createContext, useContext } from "react";
import { useCategoryStore } from "../store/useCategoryStore";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const store = useCategoryStore();

  return (
    <CategoryContext.Provider value={store}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoryContext);
}