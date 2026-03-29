import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CurrencyResponse {
  meta: {
    last_updated_at: string;
  };
  data: {
    [key: string]: {
      code: string;
      value: number;
    };
  };
  expirationTime: number;
}
interface CurrencState {
  currency: CurrencyResponse | null;
  setCurrency: (currency: CurrencyResponse) => void;
  removeCurrency: () => void;
}

export const useCurrencStore = create<CurrencState>()(
  persist(
    (set) => ({
      currency: null,
      setCurrency: (currency) => set({ currency }),
      removeCurrency: () => set({ currency: null }),
    }),
    { name: "Currenc-storage" } // Key for localStorage
  )
);
