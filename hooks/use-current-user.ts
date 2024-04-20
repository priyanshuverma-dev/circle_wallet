"use client";

import { globalState } from "@/store/global";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const useCurrentUser = () => {
  const global = globalState();
  const { data, error, isLoading, status, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/auth/me`);
        const body = await response.json();
        if (response.ok) {
          return body as User;
        } else {
          throw new Error(body.message);
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  });

  if (data && global.walletIds.length == 0) {
    global.setWalletIds(data.walletIds);

    if (global.selectedWalletId == null) {
      global.setWalletId(data.walletIds[data.walletIds.length - 1]);
    }
  }

  return {
    data,
    error,
    isLoading: isLoading,
    status,
    refetch,
  };
};

export default useCurrentUser;
