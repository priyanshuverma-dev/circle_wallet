"use client";
/**
 * This file is a modal component that is used to authenticate the user.
 * It is used to authenticate the user using Github.
 * @file components/auth/auth-modal.tsx
 */

// Import the required libraries

//#region
import { signIn } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Icons } from "../icons";
import { Button } from "../ui/button";
//#endregion

const AuthModal = () => {
  const [isLoading, setIsLoading] = useState(false); // Set the loading state
  const router = useRouter(); // Get the router
  const pathname = usePathname(); // Get the pathname
  const searchParams = useSearchParams(); // Get the search params
  const callback = searchParams.get("callbackUrl");

  // Handle the open change
  const handleOnOpenChange = (open: boolean) => {
    router.push("/");
  };

  // Handle the login
  async function onLogin() {
    try {
      setIsLoading(true); // Set the loading state to true
      const res = await signIn("github", {
        redirect: false,
      }); // Sign in using Github

      if (res?.error) throw new Error(res.error); // Throw an error if there is an error
      if (res?.ok) {
        toast.success(`Success: Authenticated`); // Show a success toast
        if (callback) {
          router.push(callback); // Redirect to the callback URL
        } else {
          router.push("/main");
        }
      }
    } catch (error: any) {
      // Catch any errors and show an error toast
      console.error(error);
      toast.error(`Error: Authentication Failed`);
    } finally {
      // Set the loading state to false
      setIsLoading(false);
    }
  }
  return (
    <Dialog open={pathname === "/auth"} onOpenChange={handleOnOpenChange}>
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
