/**
 * Header component for the wallet page
 * @description Header component for the wallet page
 * @file defines the header component for the wallet page
 */

import Link from "next/link";
import React from "react";
import MoreMenu from "./more-menu";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/wallet">
        <aside className="flex items-center gap-[2px]">
          <p className="text-3xl font-bold">Circle</p>
          <p className="text-3xl font-bold text-blue-500 underline">Wallet</p>
        </aside>
      </Link>
      <div>
        <MoreMenu />
      </div>
    </header>
  );
}
