import { User } from "@prisma/client";
import { create } from "zustand";

// Define the global state Props type
type Props = {
  selectedWalletId: string | null;
  walletIds: string[];
  setWalletId: (id: string) => void;
  setWalletIds: (ids: string[] | undefined) => void;
  user?: User;
  setUser: (user: User) => void;
  removeUser: () => void;
};

// Create the global state
export const globalState = create<Props>((set) => ({
  user: undefined, // Initialize the user to undefined
  setUser: (user: User) =>
    // Set the user and the wallet IDs on calling the setUser function
    set({
      user,
      walletIds: user.walletIds,
      selectedWalletId: user.walletIds[user.walletIds.length - 1],
    }),
  removeUser: () => set({ user: undefined }), // Remove the user from the state on calling the removeUser function
  selectedWalletId: null, // Initialize the selected wallet ID to null
  walletIds: [], // Initialize the wallet IDs to an empty array
  setWalletId: (walletId) => set({ selectedWalletId: walletId }), // Set the selected wallet ID on calling the setWalletId function
  setWalletIds: (walletIds) => set({ walletIds: walletIds }), // @deprecated Remove this line
}));
