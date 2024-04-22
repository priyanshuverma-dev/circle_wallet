/**
 * Header component for the site
 * @description Header component for the site
 * @file This file defines the header component of the site.
 */

import Link from "next/link";
import React from "react";
import { Icons } from "../icons";

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <Icons.logo className="h-6 w-6" />
        <span className="sr-only">Circle Wallet Parody</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="#features"
        >
          Features
        </Link>

        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="https://github.com/priyanshuverma-dev"
        >
          About Developer
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="https://github.com/priyanshuverma-dev/circle_wallet"
        >
          Github
        </Link>
      </nav>
    </header>
  );
}
