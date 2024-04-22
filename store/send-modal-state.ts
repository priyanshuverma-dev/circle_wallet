/**
 * Send Modal State
 * @description Zustand store for send modal state
 * @file This is the store for the send modal state.
 * It is a simple store that contains the isOpen, onOpen and onClose functions.
 * The isOpen state is used to determine if the send modal is open.
 * The onOpen function is used to open the send modal.
 * The onClose function is used to close the send modal.
 * The store is created using the create function from zustand.
 */

import { create } from "zustand";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const sendModalState = create<Props>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
