/*
  
  This component is used to show the recieve modal.
  It will show the wallet id and wallet address of the user.
  User can copy the wallet id and wallet address by clicking on the copy icon.
*/

// importing toast
import toast from "react-hot-toast";
// importing lucide react
import { Clipboard } from "lucide-react";

// importing dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// importing recieveModalState from store
import { recieveModalState } from "@/store/recieve-modal-state";

const RecieveModal = () => {
  const modal = recieveModalState(); // getting the recieve modal state

  /*
    This function is used to copy the text to the clipboard.
    It takes the text as an argument and copies it to the clipboard.
  */
  async function copyText(addr: string) {
    await window.navigator.clipboard.writeText(addr); // copying the text to the clipboard
    toast.success("copied share to recieve tokens"); // showing the success toast
  }

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={() => {
        // closing the modal
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
