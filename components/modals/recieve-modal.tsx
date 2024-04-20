import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { recieveModalState } from "@/store/recieve-modal-state";
import { Clipboard } from "lucide-react";
import toast from "react-hot-toast";

const RecieveModal = () => {
  const modal = recieveModalState();
  async function copyText(addr: string) {
    await window.navigator.clipboard.writeText(addr);
    toast.success("copied share to recieve tokens");
  }

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={() => {
        modal.onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recieve Tokens</DialogTitle>
          <DialogDescription>
            Copy the required information and refill Tokens in your wallet.
          </DialogDescription>
          <div className="flex flex-col space-y-3 p-2">
            <div className="flex items-center justify-between">
              <p className="leading-6 text-muted-foreground my-1">
                Wallet Id: {modal.walletId}
              </p>
              <button onClick={() => copyText(modal.walletId)}>
                <Clipboard className="m-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <p className="leading-6 text-muted-foreground my-1">
                Wallet Address: {modal.walletAddress}
              </p>
              <button onClick={() => copyText(modal.walletAddress)}>
                <Clipboard className="m-4 h-4" />
              </button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RecieveModal;
