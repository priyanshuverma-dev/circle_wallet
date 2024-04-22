"use client";

import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { globalState } from "@/store/global";
import { useEffect, useState } from "react";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function WalletSelector() {
  const global = globalState();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
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

  async function createWallet() {
    try {
      setLoading(true);
      const response = await fetch("/api/wallet/create");

      const data = await response.json();

      if (response.status !== 200) throw new Error(data.message);

      circleClient.setAuthentication({
        userToken: data.userToken,
        encryptionKey: data.encryptionKey,
      });

      circleClient.execute(data.challengeId, async (error, result) => {
        if (result) {
          const response = await fetch("/api/wallet/create", {
            method: "POST",
            body: JSON.stringify({}),
          });
          const data = await response.json();
          if (response.status !== 200) throw new Error(data.message);
          global.removeUser();
          qc.refetchQueries({
            queryKey: ["user"],
          });
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
    <Select
      value={global.selectedWalletId!}
      onValueChange={(v) => global.setWalletId(v)}
    >
      <SelectTrigger className="w-full bg-transparent">
        <SelectValue placeholder="address" />
      </SelectTrigger>
      <SelectContent>
        {global.walletIds.map((id) => (
          <SelectItem key={id} value={id}>
            {id}
          </SelectItem>
        ))}
        <SelectSeparator />
        <Button
          key={"btn"}
          variant={"ghost"}
          onClick={createWallet}
          disabled={loading}
          className="w-full flex justify-start items-center"
        >
          <PlusCircleIcon className="w-4 h-4 mr-1" />
          {loading ? "creating wallet" : "Create a new wallet"}
        </Button>
      </SelectContent>
    </Select>
  );
}
