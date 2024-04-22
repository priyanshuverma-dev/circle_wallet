"use client";
/**
 * This component is responsible for rendering the pin setup button in the wallet page.
 * @description This component is responsible for rendering the pin setup button that is
 * used to set the pin for the wallet.
 * @file defines the pin setup button component for the wallet page
 */

//#region Imports
import { useEffect, useState } from "react";
import { PinStatus } from "@prisma/client";
import { toast } from "react-hot-toast";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";

import useCurrentUser from "@/hooks/use-current-user";
import { useQueryClient } from "@tanstack/react-query";
import { globalState } from "@/store/global";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
//#endregion

export default function PinSetupButton() {
  /**
   * 1. This state is used to check if the component is mounted or not.
   * 2. This state is used to check if the component is loading or not.
   * 3. get the current user data from the useCurrentUser hook.
   * 4. get the global state from the global store.
   * 5. get the query client from the react-query.
   */
  const [isMounted, setIsMounted] = useState(false); // 1
  const [loading, setLoading] = useState(false); // 2
  const { data, isLoading, error } = useCurrentUser(); // 3
  const global = globalState(); // 4
  const qc = useQueryClient(); // 5

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

  if (isLoading) return null; // return null if the data is loading
  if (error) return null; // return null if there is an error
  if (data?.pinStatus === PinStatus.ENABLED) return null; // return null if the pin is already enabled

  // This function is used to set the pin for the wallet.
  async function setPin() {
    try {
      setLoading(true); // set loading to true
      const response = await fetch("/api/users/set-pin"); // call the set-pin API
      const data = await response.json(); // parse the response

      if (response.status !== 200) throw new Error(data.message); // throw an error if the response status is not 200
      circleClient.setAuthentication({
        userToken: data.userToken,
        encryptionKey: data.encryptionKey,
      }); // set the authentication for the W3S SDK

      // execute the challenge
      circleClient.execute(data.challengeId, async (error, result) => {
        try {
          if (result) {
            /**
             * Call the set-pin API with POST method and body as
             * pinStatus and securityQuestionStatus.
             */
            const response = await fetch("/api/users/set-pin", {
              method: "POST",
              body: JSON.stringify({
                pinStatus: PinStatus.ENABLED,
                securityQuestionStatus: PinStatus.ENABLED,
              }),
            });
            const data = await response.json(); // parse the response
            if (response.status !== 200) throw new Error(data.message); // throw an error if the response status is not 200

            /**
             * Call the removeUser method from the global store to remove the user
             * from the global state.
             * Call the refetchQueries method from the query client to refetch the user
             * data from the server.
             * We are doing this to update the user data in the global state.
             */
            global.removeUser();
            qc.refetchQueries({
              queryKey: ["user"],
            });

            toast.success("Success"); // show a success toast if the result is successful
          }
          if (error) throw new Error(data.message); // throw an error if there is an error
        } catch (error: any) {
          // catch the error and show an error toast
          console.error(error);
          toast.error(`Error: ${error.message}`);
        }
      });
    } catch (error: any) {
      // catch the error and show an error toast
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
