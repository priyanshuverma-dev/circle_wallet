"use client";
/**
 * This component is responsible for rendering the more menu in the wallet page.
 * @description This component is responsible for rendering the more menu that has
 * update pin, forget pin and logout options.
 */

import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MoreMenu() {
  /**
   * 1. This state is used to check if the component is mounted or not.
   * 2. This state is used to check if the component is loading or not.
   * 3. This state is used to store the session data.
   * 4. This state is used to create a new instance of the W3S SDK.
   */
  const [isMounted, setIsMounted] = useState(false); // 1
  const [loading, setLoading] = useState(false); // 2
  const session = useSession(); // 3
  const circleClient = new W3SSdk(); // 4

  // This effect is used to set the app settings for the W3S SDK.
  useEffect(() => {
    setIsMounted(true);
    circleClient.setAppSettings({
      appId: process.env.NEXT_PUBLIC_CIRCLE_APP_ID as string,
    });
  }, []);

  if (!isMounted) {
    return null;
  }

  //#region Functions

  // This function is used to restore the pin.
  async function restorePin() {
    try {
      setLoading(true); // Set loading to true
      const response = await fetch("/api/users/forget-pin"); // Call the forget-pin API
      const data = await response.json(); // Parse the response
      if (response.status !== 200) throw new Error(data.message); // Throw an error if the response status is not 200
      circleClient.setAuthentication({
        userToken: data.userToken,
        encryptionKey: data.encryptionKey,
      }); // Set the authentication for the W3S SDK

      // Execute the challenge
      circleClient.execute(data.challengeId, async (error, result) => {
        if (result) {
          toast.success("Success"); // Show a success toast if the result is successful
        }
        if (error) {
          // Show an error toast if there is an error
          console.error(error);
          toast.error(`Error: ${error.message}`);
        }
      });
    } catch (error: any) {
      // catch the error and show an error toast
      console.error(error);
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false); // finally set loading to false
    }
  }

  // This function is used to update the pin.
  async function updatePin() {
    try {
      setLoading(true); // Set loading to true
      const response = await fetch("/api/users/change-pin"); // Call the change-pin API
      const data = await response.json(); // Parse the response
      if (response.status !== 200) throw new Error(data.message); // Throw an error if the response status is not 200
      circleClient.setAuthentication({
        userToken: data.userToken,
        encryptionKey: data.encryptionKey,
      }); // Set the authentication for the W3S SDK

      circleClient.execute(data.challengeId, async (error, result) => {
        if (result) {
          toast.success("Success"); // Show a success toast if the result is successful
        }
        if (error) {
          // Show an error toast if there is an error
          console.error(error);
          toast.error(`Error: ${error.message}`);
        }
      });
    } catch (error: any) {
      // catch the error and show an error toast
      console.error(error);
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false); // finally set loading to false
    }
  }

  //#endregion

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {session.data?.user.pinStatus == "ENABLED" && (
          <>
            <DropdownMenuItem disabled={loading} onClick={updatePin}>
              Update Pin
            </DropdownMenuItem>
            <DropdownMenuItem disabled={loading} onClick={restorePin}>
              Forget Pin
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          disabled={loading}
          onClick={() =>
            signOut({
              callbackUrl: "/",
            })
          }
          className="text-destructive/90 font-bold focus:text-destructive"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
