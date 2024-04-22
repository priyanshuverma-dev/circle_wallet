"use client";
// importing react hooks
import { useEffect, useState } from "react";

// importing toast
import { Toaster } from "react-hot-toast";

// importing modals
import RecieveModal from "@/components/modals/recieve-modal";
import SendModal from "@/components/modals/send-modal";

const ModalsProvider = () => {
  // check if the component is mounted
  const [isMounted, setIsMounted] = useState(false);

  // set the component to mounted required for client side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // if the component is not mounted, return null
  if (!isMounted) {
    return null;
  }

  // return the modals
  return (
    <>
      <RecieveModal />
      <SendModal />
      <Toaster />
    </>
  );
};

export default ModalsProvider;
