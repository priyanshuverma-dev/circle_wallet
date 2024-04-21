import CenterContainer from "@/components/center-container";
import Header from "@/components/wallet/header";
import PinSetupButton from "@/components/wallet/pin-setup-button";
import UserProfile from "@/components/wallet/user-profile";
import React from "react";
import WalletDetails from "@/components/wallet/wallet-details";
import Transactions from "@/components/wallet/transactions";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return (
    <CenterContainer>
      <div className="flex flex-col mx-2 h-full">
        <Header />
        <UserProfile />
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
