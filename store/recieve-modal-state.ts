import { create } from "zustand";

type Props = {
  isOpen: boolean;
  onOpen: (id: string, addr: string) => void;
  onClose: () => void;
  walletId: string;
  walletAddress: string;
};

export const recieveModalState = create<Props>((set) => ({
  isOpen: false,
  onOpen: (id, addr) =>
    set({ isOpen: true, walletAddress: addr, walletId: id }),
  onClose: () => set({ isOpen: false, walletAddress: "", walletId: "" }),
  walletAddress: "",
  walletId: "",
}));
