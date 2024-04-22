/**
 * Features component
 * @description Features component for the site
 * @file This file defines the features component of the site.
 */

import React from "react";
import { Icons } from "../icons";

export default function Features() {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 grid gap-6 lg:grid-cols-2"
    >
      <div className="px-4 md:px-6 flex flex-col justify-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Feature rich wallet application
          </h2>
          <p className=" md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            an enhanced wallet application that encompasses the following core
            features.
          </p>
        </div>
        <ul className="grid gap-2">
          <li>
            <Icons.circleCheck className="w-4 h-4 inline-block" />
            Streamline the process for a new wallet setup
          </li>
          <li>
            <Icons.circleCheck className="w-4 h-4 inline-block" />
            Facilitate smooth token transfers between wallets
          </li>
          <li>
            <Icons.circleCheck className="w-4 h-4 inline-block" />
            Incorporate PIN recovery functionality
          </li>
        </ul>
      </div>
    </section>
  );
}
