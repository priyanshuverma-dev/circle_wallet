"use client";

/**
 * This file is used to create a custom hook to fetch transactions.
 * @file hooks/use-transactions.ts
 */

import { Transaction } from "@circle-fin/user-controlled-wallets/dist/types/clients/user-controlled-wallets";
import { useQuery } from "@tanstack/react-query";

const useTransactions = ({ walletId }: { walletId: string }) => {
  // Fetch the transactions
  const { data, error, isLoading, status, refetch } = useQuery({
    queryKey: ["transaction", walletId], // Set the query key to the wallet ID
    enabled: walletId != null, // Enable the query if the wallet ID is not null
    queryFn: async () => {
      try {
        // Fetch the transactions from the server
        const response = await fetch(`/api/wallet/${walletId}/transactions`);
        const body = await response.json(); // Parse the response body

        if (response.ok) {
          // If the response is OK return the transactions
          return body as Transaction[];
        } else {
          // If the response is not OK throw an error
          throw new Error(body.message);
        }
      } catch (error: any) {
        // Catch any errors and throw them
        throw new Error(error.message);
      }
    },
  });

  // Return the transactions
  return {
    data,
    error,
    isLoading,
    status,
    refetch,
  };
};

export default useTransactions;
