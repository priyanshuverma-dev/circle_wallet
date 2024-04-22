/**
 * CenterContainer component
 * @description CenterContainer component for the site
 * @file This file defines the CenterContainer component of the site.
 * This component is used to center the content of the site.
 */

import { cn } from "@/lib/utils";
import React from "react";

interface CenterContainerProp extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CenterContainer = ({
  children,
  className,
  ...props
}: CenterContainerProp) => {
  return (
    <div
      className={cn("flex items-center flex-col justify-center", className)}
      {...props}
    >
      <div className="w-full sm:w-[606px] border-x-2 my-1">{children}</div>
    </div>
  );
};

export default CenterContainer;
