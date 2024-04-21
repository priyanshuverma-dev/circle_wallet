import { User } from "@prisma/client";
import { create } from "zustand";

type Props = {
  selectedWalletId: string | null;
  walletIds: string[];
  setWalletId: (id: string) => void;
  setWalletIds: (ids: string[] | undefined) => void;
  user?: User;
  setUser: (user: User) => void;
  removeUser: () => void;
};

export const globalState = create<Props>((set) => ({
  user: undefined,
  setUser: (user: User) =>
    set({
      user,
      walletIds: user.walletIds,
      selectedWalletId: user.walletIds[user.walletIds.length - 1],
    }),
  removeUser: () => set({ user: undefined }),
  selectedWalletId: null,
  walletIds: [],
  setWalletId: (walletId) => set({ selectedWalletId: walletId }),
  setWalletIds: (walletIds) => set({ walletIds: walletIds }),
}));
