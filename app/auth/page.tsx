"use client";
/**
 * Auth Page
 * This is the Auth page.
 * It is a simple component that contains the AuthModal component.
 */

import AuthModal from "@/components/auth/auth-modal";
import { useEffect, useState } from "react";

const AuthPage = () => {
  // This is a simple way to check if the component is mounted required for the client side rendering
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <AuthModal />
    </div>
  );
};

export default AuthPage;
