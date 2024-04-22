"use client";
/**
 * This file is used to create a custom hook to fetch the wallet data.
 * @file hooks/use-wallet.ts
 */

import {
  Balance,
  WalletResponse,
} from "@circle-fin/user-controlled-wallets/dist/types/clients/user-controlled-wallets";
import { useQuery } from "@tanstack/react-query";

const useWallet = ({ walletId }: { walletId: string }) => {
  // Fetch the wallet data
  const { data, error, isLoading, status, refetch } = useQuery({
    enabled: walletId != null, // Enable the query if the wallet ID is not null
    queryKey: ["wallet", walletId], // Set the query key to the wallet ID
    queryFn: async () => {
      // Fetch the wallet data
      try {
        // Fetch the wallet data from the server
        const response = await fetch(`/api/wallet/${walletId}`);
        const body = await response.json(); // Parse the response body
        if (response.ok) {
          // If the response is OK return the wallet data
          return body as {
            wallet: WalletResponse;
            tokens: Balance[];
          };
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

  // Return the wallet data
  return {
    data,
    error,
    isLoading,
    status,
    refetch,
  };
};

export default useWallet;
