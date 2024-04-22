/**
 * @file This is the Auth page.
 * It is a simple component that contains the AuthModal component.
 * The AuthModal component is used to display the login forms.
 */

import React from "react";
import AuthModal from "@/components/auth/auth-modal";

const Page = () => {
  return (
    <div>
      <AuthModal />
    </div>
  );
};

export default Page;
