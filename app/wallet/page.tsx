/**
 * @file wallet/page.tsx
 * This is the wallet page.
 * It is a simple component that contains the header, user profile, wallet details,
 * transactions and pin setup button components.
 */

import React from "react";

import CenterContainer from "@/components/center-container";
import Header from "@/components/wallet/header";
import PinSetupButton from "@/components/wallet/pin-setup-button";
import UserProfile from "@/components/wallet/user-profile";
import WalletDetails from "@/components/wallet/wallet-details";
import Transactions from "@/components/wallet/transactions";

// Import the auth function
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth(); // Call the auth function
  return (
    <CenterContainer>
      <div className="flex flex-col mx-2 h-full">
        <Header />
        <UserProfile />
        {/* 
          If the user has a wallet, display the wallet details and transactions.
          Otherwise, display the pin setup button.
        */}
        {session?.user.walletIds.length != 0 ? (
          <>
            <WalletDetails />
            <Transactions />
          </>
        ) : (
          <PinSetupButton />
        )}
      </div>
    </CenterContainer>
  );
}
