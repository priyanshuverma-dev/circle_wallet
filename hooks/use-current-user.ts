"use client";

import { globalState } from "@/store/global";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const useCurrentUser = () => {
  const global = globalState();
  const shouldFetch = !global.user;
  const { data, error, isLoading, status, refetch } = useQuery({
    queryKey: ["user"],
    enabled: shouldFetch,
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

  if (data && !global.user) {
    global.setUser(data);
  }

  return {
    data: global.user || data,
    error,
    isLoading: isLoading && shouldFetch,
    status,
    refetch,
  };
};

export default useCurrentUser;
