import { ProductsData } from "@/pages/basket/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BasketState {
  Basket: ProductsData[] | null;
  setBasket: (Basket: ProductsData[]) => void;
  removeBasket: () => void;
}

export const useBasketStore = create<BasketState>()(
  persist(
    (set) => ({
      Basket: null,
      setBasket: (Basket) => set({ Basket }),
      removeBasket: () => set({ Basket: null }),
    }),
    { name: "Basket-storage" } // Key for localStorage
  )
);
