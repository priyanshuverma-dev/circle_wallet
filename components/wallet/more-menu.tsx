"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { MoreVertical } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function MoreMenu() {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const circleClient = new W3SSdk();

  useEffect(() => {
    setIsMounted(true);
    circleClient.setAppSettings({
      appId: process.env.NEXT_PUBLIC_CIRCLE_APP_ID as string,
    });
  }, []);

  if (!isMounted) {
    return null;
  }

  async function restorePin() {
    try {
      setLoading(true);
      const response = await fetch("/api/users/forget-pin");
      const data = await response.json();
      if (response.status !== 200) throw new Error(data.message);
      circleClient.setAuthentication({
        userToken: data.userToken,
        encryptionKey: data.encryptionKey,
      });

      circleClient.execute(data.challengeId, async (error, result) => {
        if (result) {
          toast.success("Success");
        }
        if (error) {
          console.error(error);
          toast.error(`Error: ${error.message}`);
        }
      });
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  async function updatePin() {
    try {
      setLoading(true);
      const response = await fetch("/api/users/change-pin");
      const data = await response.json();
      if (response.status !== 200) throw new Error(data.message);
      circleClient.setAuthentication({
        userToken: data.userToken,
        encryptionKey: data.encryptionKey,
      });

      circleClient.execute(data.challengeId, async (error, result) => {
        if (result) {
          toast.success("Success");
        }
        if (error) {
          console.error(error);
          toast.error(`Error: ${error.message}`);
        }
      });
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

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
