"use client";
/**
 * This component is responsible for rendering the transactions in the wallet page.
 * @description This component is responsible for rendering the transactions that are
 * done in the wallet.
 * @file defines the transactions component for the wallet page
 */
import useTransactions from "@/hooks/use-transactions";
import { globalState } from "@/store/global";

import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";

export default function Transactions() {
  const global = globalState(); // get the global state from the global store
  const { data, error, isLoading } = useTransactions({
    walletId: global.selectedWalletId!,
  }); // get the transactions data from the useTransactions hook

  // return the skeleton if the data is loading or the selected wallet id is null
  if (isLoading || global.selectedWalletId == null) {
    return (
      <div className="flex justify-center items-center p-2 flex-col w-full">
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  // return the error message if there is an error
  if (error) {
    return (
      <details className="text-destructive leading-8">
        <summary>Error loading user profile 😢</summary>
        {error.message}
      </details>
    );
  }

  return (
    <div className="w-full flex flex-col mb-20">
      <p className="leading-6 text-muted-foreground my-1">Transactions</p>
      <Separator />
      <ScrollArea className="h-72">
        {data?.length == 0 && (
          <p className="leading-6 text-muted-foreground my-1 text-sm">
            No Transactions
          </p>
        )}
        {data?.map((transaction) => (
          <div
            key={transaction.id}
            className={cn(
              "flex justify-between p-2 border-2 border-muted m-1 rounded-lg space-y-3",
              transaction.state == "COMPLETE" && " text-green-500",
              transaction.state == "FAILED" && " text-red-500"
            )}
          >
            <div className="flex justify-start flex-col">
              <div className="py-1 space-y-2">
                <p className="leading-3 text-lg">
                  {transaction.transactionType} - {transaction.state}
                </p>
                <p className="leading-3 text-lg">
                  Amount: {transaction.amounts?.at(0)}
                </p>
                <p className="leading-3 text-muted-foreground text-sm">
                  {transaction.blockchain}
                </p>
              </div>
              <div className="py-1 space-y-1">
                <p className="leading-3 text-muted-foreground text-sm">
                  {transaction.errorReason &&
                    `Reason ${transaction.errorReason}`}
                </p>
                <p className="leading-3 text-muted-foreground text-sm">
                  TokenId: {transaction.tokenId}
                </p>
                <p className="leading-3 text-muted-foreground text-sm">
                  Destination: {transaction.destinationAddress}
                </p>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
