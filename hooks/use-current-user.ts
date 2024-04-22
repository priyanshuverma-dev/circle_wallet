"use client";
/**
 * This file is used to create a custom hook to fetch the current user.
 * @file hooks/use-current-user.ts
 */

import { globalState } from "@/store/global";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const useCurrentUser = () => {
  // get the global state
  const global = globalState();
  const shouldFetch = !global.user; // Fetch the user if it is not already in global state
  const { data, error, isLoading, status, refetch } = useQuery({
    queryKey: ["user"], // query key
    enabled: shouldFetch, // enable the query if shouldFetch is true
    queryFn: async () => {
      try {
        // Fetch the user from the server
        const response = await fetch(`/api/auth/me`);
        const body = await response.json(); // Parse the response body
        if (response.ok) {
          // If the response is OK return the user
          return body as User;
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

  // Set the user in the global state if it is not already set and the data is available
  if (data && !global.user) {
    global.setUser(data);
  }

  return {
    data: global.user || data, // return the user from the global state or the data
    error,
    isLoading: isLoading && shouldFetch, // return the loading status
    status,
    refetch,
  };
};

export default useCurrentUser;
