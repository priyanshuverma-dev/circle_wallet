"use client";
/**
 * This component is responsible for rendering the user profile in the wallet page.
 * @description This component is responsible for rendering the user profile that has
 * the user name, email and pin status.
 * @file defines the user profile component for the wallet page
 */
import { PinStatus } from "@prisma/client";
import useCurrentUser from "@/hooks/use-current-user";

import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { cn } from "@/lib/utils";

const UserProfile = () => {
  const { data: user, isLoading, error } = useCurrentUser(); // get the current user data from the useCurrentUser hook

  // return the skeleton if the data is loading
  if (isLoading) return <UserProfileLoading />;

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
    <div className="flex items-start justify-start py-2">
      <Avatar className="w-28 h-28 rounded-full mr-3 shadow">
        <AvatarImage src={user?.image ?? ""} />
        <AvatarFallback>{user?.name?.at(0)}</AvatarFallback>
      </Avatar>
      <div className="py-2">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {user?.name}
        </h2>
        <p className="text-sm text-muted-foreground mb-2">{user?.email}</p>
        <span
          className={cn(
            "py-1 px-4 rounded-full text-xs font-medium ",
            user?.pinStatus === PinStatus.ENABLED
              ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500"
              : user?.pinStatus === PinStatus.UNSET
              ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500"
              : user?.pinStatus === PinStatus.LOCKED
              ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-500"
          )}
        >
          Pin Status: {user?.pinStatus}
        </span>
      </div>
    </div>
  );
};
export default UserProfile;

const UserProfileLoading = () => {
  return (
    <div className="flex items-start justify-start py-2">
      <Skeleton className="w-28 h-28 rounded-full mr-3 shadow" />
      <div className="py-2">
        <Skeleton className="w-40 h-6 mb-2" />
        <Skeleton className="w-20 h-4" />
      </div>
    </div>
  );
};
