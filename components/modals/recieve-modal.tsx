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
        <DialogHeader className="!text-left">
          <DialogTitle>Recieve Tokens</DialogTitle>
          <DialogDescription className="">
            Copy the required information and refill Tokens in your wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 p-2 truncate">
          <div className="flex items-center justify-between">
            <p className="leading-6 text-muted-foreground w-[80%] my-1 truncate">
              Wallet Id: {modal.walletId}
            </p>
            <button onClick={() => copyText(modal.walletId)}>
              <Clipboard className="m-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="leading-6 text-muted-foreground my-1 w-[80%] truncate">
              Wallet Address: {modal.walletAddress}
            </p>
            <button onClick={() => copyText(modal.walletAddress)}>
              <Clipboard className="m-4 h-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecieveModal;
