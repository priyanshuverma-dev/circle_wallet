import { create } from "zustand";

// Define the Props type
type Props = {
  isOpen: boolean;
  onOpen: (id: string, addr: string) => void;
  onClose: () => void;
  walletId: string;
  walletAddress: string;
};

export const recieveModalState = create<Props>((set) => ({
  isOpen: false, // Initialize the isOpen state to false
  onOpen: (id, addr) =>
    // Set the isOpen state to true and set the wallet ID and wallet address
    set({ isOpen: true, walletAddress: addr, walletId: id }),
  onClose: () => set({ isOpen: false, walletAddress: "", walletId: "" }), // Set the isOpen state to false and reset the wallet ID and wallet address
  walletAddress: "", // Initialize the wallet address to an empty string
  walletId: "", // Initialize the wallet ID to an empty string
}));
