import { PinStatus } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  userCreated: boolean;
  walletIds: string[];
  pinStatus: PinStatus;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
