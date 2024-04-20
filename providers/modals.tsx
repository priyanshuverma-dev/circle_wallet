"use client";

import RecieveModal from "@/components/modals/recieve-modal";
import SendModal from "@/components/modals/send-modal";
import React, { useEffect, useState } from "react";

const ModalsProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <RecieveModal />
      <SendModal />
    </>
  );
};

export default ModalsProvider;
