import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/providers/auth";
import { ThemeProvider } from "@/providers/theme";
import { auth } from "@/auth";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/providers/query";
import ModalsProvider from "@/providers/modals";

const font = DM_Sans({ subsets: ["latin"] });

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
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider session={session}>
        <body
          className={cn(
            font.className,
            "bg-gradient-to-r from-slate-900 to-stone-800 !scroll-smooth"
          )}
        >
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              {modal}
              <Toaster />
              <ModalsProvider />
            </ThemeProvider>
          </QueryProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
