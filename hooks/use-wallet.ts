"use client";

import {
  Balance,
  WalletResponse,
} from "@circle-fin/user-controlled-wallets/dist/types/clients/user-controlled-wallets";

import { useQuery } from "@tanstack/react-query";

const useWallet = ({ walletId }: { walletId: string }) => {
  const { data, error, isLoading, status, refetch } = useQuery({
    enabled: walletId != null,
    queryKey: ["wallet", walletId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/wallet/${walletId}`);
        const body = await response.json();
        if (response.ok) {
          return body as {
            wallet: WalletResponse;
            tokens: Balance[];
          };
        } else {
          throw new Error(body.message);
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  });

  return {
    data,
    error,
    isLoading,
    status,
    refetch,
  };
};

export default useWallet;
