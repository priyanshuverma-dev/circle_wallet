import { create } from "zustand";

type Props = {
  selectedWalletId: string | null;
  walletIds: string[];
  setWalletId: (id: string) => void;
  setWalletIds: (ids: string[] | undefined) => void;
};

export const globalState = create<Props>((set) => ({
  selectedWalletId: null,
  walletIds: [],
  setWalletId: (walletId) => set({ selectedWalletId: walletId }),
  setWalletIds: (walletIds) => set({ walletIds: walletIds }),
}));
