"use client";

import { Transaction } from "@circle-fin/user-controlled-wallets/dist/types/clients/user-controlled-wallets";

import { useQuery } from "@tanstack/react-query";

const useTransactions = ({ walletId }: { walletId: string }) => {
  const { data, error, isLoading, status, refetch } = useQuery({
    queryKey: ["transaction", walletId],
    enabled: walletId != null,
    queryFn: async () => {
      try {
        const response = await fetch(`/api/wallet/${walletId}/transactions`);
        const body = await response.json();
        if (response.ok) {
          return body as Transaction[];
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

export default useTransactions;
