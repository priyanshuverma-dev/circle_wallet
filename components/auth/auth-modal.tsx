"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { signIn } from "next-auth/react";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const AuthModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const r = usePathname();

  const searchParams = useSearchParams();
  const callback = searchParams.get("callbackUrl");

  const handleOnOpenChange = (open: boolean) => {
    router.push("/");
  };

  async function onLogin() {
    try {
      setIsLoading(true);
      const res = await signIn("github", {
        redirect: false,
      });
      if (res?.error) throw new Error(res.error);
      if (res?.ok) {
        toast.success(`Success: Authenticated`);
        if (callback) {
          router.push(callback);
        } else {
          router.push("/main");
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(`Error: Authentication Failed`);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Dialog open={r === "/auth"} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Authenticate Now</DialogTitle>
          <DialogDescription>
            <div className="flex justify-center items-center p-4 flex-col">
              <div className="flex">
                <p>Continue with Github to create your wallet</p>
              </div>

              <Button
                type="button"
                onClick={onLogin}
                disabled={isLoading}
                className="mt-4 w-full sm:w-auto"
              >
                <Icons.gitHub className="mr-2 h-4 w-4" /> Create A wallet with
                Github
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
