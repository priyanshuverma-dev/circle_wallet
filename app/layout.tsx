// importing types and fonts
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

// importing css file
import "./globals.css";

import { cn } from "@/lib/utils";
import { auth } from "@/auth";

// importing providers
import ThemeProvider from "@/providers/theme";
import AuthProvider from "@/providers/auth";
import QueryProvider from "@/providers/query";
import ModalsProvider from "@/providers/modals";

// font declaration
const font = DM_Sans({ subsets: ["latin"] });

// metadata declaration
export const metadata: Metadata = {
  title: "Circle Wallet - Bounty",
  description: "Stackup Bounty - Circle Wallet",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  // auth function from auth.ts
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          font.className,
          "bg-gradient-to-r from-slate-900 to-stone-800 !scroll-smooth"
        )}
      >
        <AuthProvider session={session}>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
              {children}
              {modal}
              <ModalsProvider />
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
