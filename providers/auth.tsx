"use client";

import { SessionProvider } from "next-auth/react";

export interface AuthContextProps {
  children: React.ReactNode;
  session: any;
}

export default function AuthProvider({ children, session }: AuthContextProps) {
  // session is passed as a prop to the SessionProvider
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
