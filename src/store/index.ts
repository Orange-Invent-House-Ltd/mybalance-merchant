import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


type Store = {
  user:  any | null;
  widget: boolean;
  paymentBreakdown: any | null
  setUser: (authUser: any | null) => void;
  setWidget: (widget: boolean) => void;
  setPaymentBreakdown: (payment: null) => void;
};

const useStore = create(
  persist<Store>(
    (set, get) => ({
      user: null,
      widget: false,
      paymentBreakdown: null,
      setUser: (authUser) => set((state) => ({ ...state, user: authUser })),
      setWidget: (widget) => set((state) => ({ ...state, widget: widget })),
      setPaymentBreakdown: (payment) => set((state) => ({ ...state, paymentBreakdown: payment })),
    }),
    {
      name: "store", // Set a name for your persisted store
      //storage: createJSONStorage(()=> sessionStorage) // (optional) by default, 'localStorage' is used
    }
  )
);

export default useStore;
