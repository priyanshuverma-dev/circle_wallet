import CenterContainer from "@/components/center-container";
import InitailizeUserButton from "@/components/wallet/initialise-user-button";
import Header from "@/components/wallet/header";
import PinSetupButton from "@/components/wallet/pin-setup-button";
import UserProfile from "@/components/wallet/user-profile";
import React from "react";
import WalletDetails from "@/components/wallet/wallet-details";
import Transactions from "@/components/wallet/transactions";

export default function Page() {
  return (
    <CenterContainer>
      <div className="flex flex-col mx-2 h-full">
        <Header />
        <UserProfile />
        <InitailizeUserButton />
        <PinSetupButton />
        <WalletDetails />
      </div>
    </CenterContainer>
  );
}
