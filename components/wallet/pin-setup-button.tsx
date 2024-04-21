"use client";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { PinStatus } from "@prisma/client";
import useCurrentUser from "@/hooks/use-current-user";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { useQueryClient } from "@tanstack/react-query";

export default function PinSetupButton() {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data, isLoading, error } = useCurrentUser();
  const qc = useQueryClient();

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

  if (isLoading) return null;
  if (error) return null;
  if (data?.pinStatus === PinStatus.ENABLED) return null;

  async function setPin() {
    try {
      setLoading(true);
      const response = await fetch("/api/users/set-pin");

      const data = await response.json();

      if (response.status !== 200) throw new Error(data.message);
      circleClient.setAuthentication({
        userToken: data.userToken,
        encryptionKey: data.encryptionKey,
      });

      circleClient.execute(data.challengeId, async (error, result) => {
        try {
          if (result) {
            const response = await fetch("/api/users/set-pin", {
              method: "POST",
              body: JSON.stringify({
                pinStatus: PinStatus.ENABLED,
                securityQuestionStatus: PinStatus.ENABLED,
              }),
            });
            const data = await response.json();
            if (response.status !== 200) throw new Error(data.message);
            toast.success("Success");
            await qc.fetchQuery({
              queryKey: ["me"],
            });
          }
          if (error) throw new Error(data.message);
        } catch (error: any) {
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
    <>
      <div className="flex justify-center items-center flex-col">
        <div className="text-center text-lg mb-4">
          You need to set pin your account to start using the wallet
        </div>
        <Button
          onClick={setPin}
          disabled={loading}
          variant={"blue"}
          className="w-[80%] mb-4"
        >
          Set Pin and create wallet
        </Button>
      </div>
      <Separator />
    </>
  );
}
