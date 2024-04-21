"use client";

import useWallet from "@/hooks/use-wallet";
import { globalState } from "@/store/global";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "../ui/select";
import { Clipboard, PlusCircleIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import WalletSelector from "./wallet-selector";
import { recieveModalState } from "@/store/recieve-modal-state";
import { sendModalState } from "@/store/send-modal-state";

export default function WalletDetails() {
  const global = globalState();
  const recieveModal = recieveModalState();
  const sendModal = sendModalState();
  const {
    data,
    isLoading: walletLoading,
    error: walletError,
  } = useWallet({
    walletId: global.selectedWalletId!,
  });

  if (global.selectedWalletId == null || walletLoading)
    return (
      <div className="flex justify-center items-center p-2 flex-col w-full">
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  if (walletError) return <p>Wallet Error: {walletError.message}</p>;

  async function copyAddress(addr: string) {
    await window.navigator.clipboard.writeText(addr);
    toast.success("Address copied share to recieve tokens");
  }

  return (
    <div className="flex justify-center items-center p-2 flex-col">
      <div className="w-full">
        <WalletSelector />
      </div>
      <div className="flex items-center justify-between">
        <p className="leading-6 text-muted-foreground my-1">
          Wallet Address: {data?.wallet.address}
        </p>
        <button onClick={() => copyAddress(data?.wallet.address!)}>
          <Clipboard className="m-4 h-4" />
        </button>
      </div>
      <Separator />
      <div className="w-full flex flex-col">
        <p className="leading-6 text-muted-foreground my-1">Available Tokens</p>
        <Separator />
        {data?.tokens.length == 0 && (
          <p className="leading-6 text-muted-foreground my-1 text-sm">
            No Token in wallet
          </p>
        )}
        {data?.tokens.map((token) => (
          <div
            key={token.token.id}
            className="flex justify-between p-2 border-2 border-muted m-1 rounded-lg space-y-3"
          >
            <div className="flex justify-start flex-col space-y-3">
              <p className="leading-3 text-lg">{token.token.name}</p>
              <p className="leading-3 text-muted-foreground text-sm">
                {token.token.symbol}
              </p>
            </div>

            <div>
              <p className="leading-3 text-lg">{token.amount}</p>
            </div>
          </div>
        ))}
      </div>
      <Separator />
      <div className="w-full flex justify-between items-center py-2">
        <Button
          onClick={() =>
            recieveModal.onOpen(data?.wallet.id!, data?.wallet.address!)
          }
          variant={"blue"}
          className="w-full"
        >
          Receive
        </Button>
        <Button
          onClick={() => sendModal.onOpen()}
          variant={"blue"}
          className="w-full"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
