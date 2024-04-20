"use client";

import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";

export default function InitailizeUserButton() {
  const { data: session, status } = useSession();
  const queryClient = new QueryClient();
  const [loading, setLoading] = useState(false);

  if (status == "unauthenticated") return null;

  if (session?.user?.userCreated) return null;

  async function initializeAccount() {
    try {
      if (!session?.user?.id) throw new Error("User ID not found");

      setLoading(true);

      // Call the API to initialize the account
      const res = await fetch("/api/users/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      await queryClient.refetchQueries({
        queryKey: ["me"],
        exact: true,
      });

      toast.success("Account initialized");
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: Initializing account`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <div className="text-center text-lg mb-4">
          You need to initialize your account to start using the wallet
        </div>
        <Button
          disabled={loading}
          onClick={initializeAccount}
          variant={"blue"}
          className="w-[80%] mb-4"
        >
          {loading ? "Initializing..." : "Initailize your account"}
        </Button>
      </div>
      <Separator />
    </>
  );
}
