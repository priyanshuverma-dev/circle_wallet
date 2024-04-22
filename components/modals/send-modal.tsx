"use client";

/*
  This is the send modal component.
  This component is used to send tokens to another user.
  It will show a form where user can fill the details and send tokens.
*/

//#region Imports

// importing react hooks
import { useEffect, useState } from "react"; // importing react hooks
import { useForm } from "react-hook-form"; // importing react hook form
import { zodResolver } from "@hookform/resolvers/zod"; // importing zod resolver
import { sendModalState } from "@/store/send-modal-state"; // importing send modal state
import useWallet from "@/hooks/use-wallet"; // importing use wallet hook
import { globalState } from "@/store/global"; // importing global state

// importing zod and toast and form schema
import { z } from "zod";
import toast from "react-hot-toast";
import { sendFormSchema } from "@/lib/schemas";

// importing w3s sdk and query client
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { useQueryClient } from "@tanstack/react-query";

// importing lucide react
import { PlusCircleIcon } from "lucide-react";

// importing ui components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

//#endregion

const SendModal = () => {
  const modal = sendModalState(); // getting the send modal state
  const global = globalState(); // getting the global state
  const qc = useQueryClient(); // getting the query client to refetch the queries

  /*
    This hook is used to get the wallet details of the user.
    It takes the wallet id as an argument and fetches the wallet details.
  */
  const { data, isLoading } = useWallet({
    walletId: global.selectedWalletId!,
  });

  const contacts = global.user?.contacts ?? []; // getting the contacts from the global state user
  // setting the component to mounted
  const [isMounted, setIsMounted] = useState(false);
  // setting the loading state
  const [loading, setLoading] = useState(false);
  // setting the show name field state
  const [showNameField, setShowNameField] = useState(false);

  // setting the form with the zod resolver
  const form = useForm<z.infer<typeof sendFormSchema>>({
    resolver: zodResolver(sendFormSchema),
    mode: "onChange",
    defaultValues: {
      fromAddress: "",
      destinationAddress: "",
      tokenId: "",
      amount: 0,
    },
  });

  const circleClient = new W3SSdk(); // creating a new instance of w3s sdk

  // setting the component to mounted
  useEffect(() => {
    setIsMounted(true);

    // setting the app settings for the circle client
    circleClient.setAppSettings({
      appId: process.env.NEXT_PUBLIC_CIRCLE_APP_ID as string, // setting the app id
    });
  }, []);

  // if the component is not mounted, return null
  if (!isMounted) {
    return null;
  }

  // if the form is not loading and the from address is empty, set the from address to the wallet address
  if (!isLoading && form.getValues().fromAddress === "") {
    form.setValue("fromAddress", data?.wallet.address!); // setting the from address to the wallet address
  }

  // this function is used to send the tokens [form submit action]
  async function onSubmit(values: z.infer<typeof sendFormSchema>) {
    try {
      // setting the loading state to true to disable the form inputs
      setLoading(true);

      //#region form validation

      // getting the selected token
      const selectedToken = data?.tokens.find(
        (t) => t.token.id === values.tokenId
      )!;

      // checking if the amount is greater then the selected token amount
      if (values.amount > Number(selectedToken.amount)) {
        form.setError("amount", {
          message: "Insuffient balance",
        }); // setting the error message if the amount is greater then the selected token amount
        return;
      }

      // checking if the destination address is same as the from address
      if (values.destinationAddress == values.fromAddress) {
        form.setError("destinationAddress", {
          message: "You can't send token to yourself",
        }); // setting the error message if the destination address is same as the from address
        return;
      }

      //#endregion

      /**
       * This is the api call to send the tokens to the destination address.
       * It takes the wallet id and the form values as an argument.
       * 1. It sends the tokens to the destination address.
       * 2. If the response is not 200, it throws an error.
       * 3. It also sets the authentication for the circle client.
       * 4. If the response is 200, it resets the form and closes the modal.
       * 5. It also executes the challenge id for the circle client.
       * 6. If there is an error, it logs the error and shows the toast error message.
       */
      const res = await fetch(
        `/api/wallet/${data?.wallet.id}/transactions/send`,
        { method: "POST", body: JSON.stringify(values) }
      ); // 1. sending the api request to send the tokens

      const body = await res.json(); // getting the response body
      if (res.status != 200) throw new Error(body.message); // 2. throwing an error if the response status is not 200

      circleClient.setAuthentication({
        userToken: body.userToken,
        encryptionKey: body.encryptionKey,
      }); // 3. setting the authentication for the circle client

      form.reset(); // 4. resetting the form
      modal.onClose(); // 4. closing the modal

      // 5. executing the challenge id for the circle client
      circleClient.execute(body.challengeId, async (error, result) => {
        if (result) {
          toast.success("Transation is in progress"); // showing the success toast message

          // refetching the queries
          qc.refetchQueries({
            queryKey: ["wallet", global.selectedWalletId!],
          });
          qc.refetchQueries({
            queryKey: ["transaction", global.selectedWalletId!],
          });
        }

        // 6. logging the error and showing the toast error message
        if (error) {
          console.error("ERROR WITH CIRCLE CLIENT:", error);
          toast.error(`Error: ${error.message}`);
        }
      });
    } catch (error: any) {
      // logging the error and showing the toast error message

      console.error("ERROR WITH SENDING TOKENS:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      // setting the loading state to false
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={() => {
        modal.onClose();
      }}
    >
      <DialogContent>
        <DialogHeader className="!text-left">
          <DialogTitle>Send Tokens</DialogTitle>
          <DialogDescription>
            Send Tokens to anyone by filling correct details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fromAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Address</FormLabel>
                  <FormControl>
                    <Input placeholder="auto fetching.." disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={loading}
              control={form.control}
              name="destinationAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination Address</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Enter reciever address" {...field} />
                      {form.getValues("destinationAddress")?.length > 1 && (
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-2"
                          onClick={() => setShowNameField(true)}
                        >
                          <PlusCircleIcon />
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <Select
                    onValueChange={(v) =>
                      form.setValue("destinationAddress", v)
                    }
                  >
                    <SelectTrigger className="">Recent addresses</SelectTrigger>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem value={contact.address}>
                          {contact.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showNameField && (
              <FormField
                disabled={loading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reciever's Name (optional)</FormLabel>

                    <FormControl>
                      <Input placeholder="Name of Reciever" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              disabled={loading}
              control={form.control}
              name="tokenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data?.tokens.map((token) => (
                        <SelectItem value={token.token.id}>
                          {token.token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={loading}
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter amount"
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit">
              Send
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SendModal;
