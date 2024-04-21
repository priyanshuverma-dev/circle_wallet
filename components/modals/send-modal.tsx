"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendModalState } from "@/store/send-modal-state";

import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { globalState } from "@/store/global";
import useWallet from "@/hooks/use-wallet";
import { useEffect, useState } from "react";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";

const formSchema = z.object({
  destinationAddress: z.string().min(3, {
    message: "Destination address is required",
  }),
  name: z.string().optional(),
  fromAddress: z.string(),
  tokenId: z.string().min(1, {
    message: "Token is required",
  }),
  amount: z.coerce.number().gt(0, {
    message: "Amount should be greater then 0",
  }),
});

const SendModal = () => {
  const modal = sendModalState();
  const global = globalState();
  const contacts = global.user?.contacts ?? [];
  const { data, isLoading, error } = useWallet({
    walletId: global.selectedWalletId!,
  });
  const qc = useQueryClient();

  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNameField, setShowNameField] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      fromAddress: "",
      destinationAddress: "",
      tokenId: "",
      amount: 0,
    },
  });

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

  if (!isLoading && form.getValues().fromAddress === "") {
    form.setValue("fromAddress", data?.wallet.address!);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const selectedToken = data?.tokens.find(
        (t) => t.token.id === values.tokenId
      )!;

      if (values.amount > Number(selectedToken.amount)) {
        form.setError("amount", {
          message: "Insuffient balance",
        });
        return;
      }
      if (values.destinationAddress == values.fromAddress) {
        form.setError("destinationAddress", {
          message: "You can't send token to yourself",
        });
        return;
      }

      const res = await fetch(
        `/api/wallet/${data?.wallet.id}/transactions/send`,
        {
          method: "POST",
          body: JSON.stringify(values),
        }
      );

      const body = await res.json();
      if (res.status != 200) throw new Error(body.message);

      circleClient.setAuthentication({
        userToken: body.userToken,
        encryptionKey: body.encryptionKey,
      });

      form.reset();
      modal.onClose();

      circleClient.execute(body.challengeId, async (error, result) => {
        if (result) {
          toast.success("Transation is in progress");
          qc.refetchQueries({
            queryKey: ["wallet", global.selectedWalletId!],
          });
          qc.refetchQueries({
            queryKey: ["transaction", global.selectedWalletId!],
          });
        }
        if (error) {
          console.error(error);
          toast.error(`Error: ${error.message}`);
        }
      });

      console.log(values);
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    } finally {
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
        <DialogHeader>
          <DialogTitle>Send Tokens</DialogTitle>
          <DialogDescription>
            Send Tokens to anyone by filling correct details.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="fromAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="auto fetching.."
                        disabled
                        {...field}
                      />
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
                        <Input
                          placeholder="Enter reciever address"
                          {...field}
                        />
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
                      <SelectTrigger className="">
                        Recent addresses
                      </SelectTrigger>
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SendModal;
