"use client";

/**
 * This component is responsible for rendering the wallet selector in the wallet page.
 * @description This component is responsible for rendering the wallet selector that is
 * used to select the wallet from the list of wallets.
 * @file defines the wallet selector component for the wallet page
 */

import { useEffect, useState } from "react";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { globalState } from "@/store/global";

import { PlusCircleIcon } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function WalletSelector() {
  const global = globalState(); // get the global state from the global store
  const [isMounted, setIsMounted] = useState(false); // check if the component is mounted or not
  const [loading, setLoading] = useState(false); // check if the component is loading or not
  const qc = useQueryClient(); // get the query client from the react-query
  const circleClient = new W3SSdk(); // initialize the new W3S SDK

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

  // This function is used to create a new wallet.
  async function createWallet() {
    try {
      setLoading(true); // set loading to true
      const response = await fetch("/api/wallet/create"); // call the create wallet API
      const data = await response.json(); // parse the response

      if (response.status !== 200) throw new Error(data.message); // throw an error if the response status is not 200

      circleClient.setAuthentication({
        userToken: data.userToken,
        encryptionKey: data.encryptionKey,
      }); // set the authentication for the W3S SDK

      // execute the challenge
      circleClient.execute(data.challengeId, async (error, result) => {
        if (result) {
          /**
           * If the result is true, call /api/wallet/create with POST method
           * to add walletId in db.
           */
          const response = await fetch("/api/wallet/create", {
            method: "POST",
            body: JSON.stringify({}),
          });
          const data = await response.json(); // parse the response
          if (response.status !== 200) throw new Error(data.message); // throw an error if the response status is not 200

          /**
           * If the response status is 200, remove the user from the global state
           * and refetch the user data.
           * we are removing the user from the global state because the user wallet
           * is changed. and we need to update the user data.
           * Show the success toast.
           */
          global.removeUser();
          qc.refetchQueries({
            queryKey: ["user"],
          });
          toast.success("Success");
        }
        if (error) {
          // If there is an error, log the error and show the error toast.
          console.error(error);
          toast.error(`Error: ${error.message}`);
        }
      });
    } catch (error: any) {
      // If there is an error, log the error and show the error toast.
      console.error(error);
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false); // set loading to false
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
