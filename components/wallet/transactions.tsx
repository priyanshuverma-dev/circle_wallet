"use client";

import useTransactions from "@/hooks/use-transactions";
import { Skeleton } from "../ui/skeleton";
import { globalState } from "@/store/global";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
export default function Transactions() {
  const global = globalState();

  const { data, error, isLoading } = useTransactions();

  console.log(data);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-2 flex-col w-full">
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }
  if (error) {
    return (
      <details className="text-destructive leading-8">
        <summary>Error loading user profile 😢</summary>
        {error.message}
      </details>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <p className="leading-6 text-muted-foreground my-1">Transactions</p>
      <Separator />
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
                {transaction.errorReason && `Reason ${transaction.errorReason}`}
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
    </div>
  );
}