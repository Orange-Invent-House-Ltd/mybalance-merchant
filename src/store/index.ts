import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


type Store = {
  user:  any | null;
  payModal: boolean;
  paymentBreakdown: any | null
  paymentLink: string;
  setUser: (authUser: any | null) => void;
  setPayModal: (widget: boolean) => void;
  setPaymentBreakdown: (payment: null) => void;
  setPaymentLink: (payment: string) => void;
};

const useStore = create(
  persist<Store>(
    (set, get) => ({
      user: null,
      payModal: false,
      paymentBreakdown: null,
      paymentLink: '',
      setUser: (authUser) => set((state) => ({ ...state, user: authUser })),
      setPayModal: (payModal) => set((state) => ({ ...state, payModal: payModal })),
      setPaymentBreakdown: (payment) => set((state) => ({ ...state, paymentBreakdown: payment })),
      setPaymentLink: (paymentLink) => set((state) => ({ ...state, paymentLink: paymentLink })),
    }),
    {
      name: "store", // Set a name for your persisted store
      //storage: createJSONStorage(()=> sessionStorage) // (optional) by default, 'localStorage' is used
    }
  )
);

export default useStore;
