/**
 * This file is responsible for setting up the NextAuth.js configuration.
 * It uses the PrismaAdapter to connect to the database.
 * It also sets up the event listener to create a user in the Circle API when a user is created.
 * @file auth.ts
 */

import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";

import db from "./lib/db";
import circleServer from "./lib/circle-server";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db), // Use the PrismaAdapter to connect to the database
  events: {
    // Create a user in the Circle API when a user is created
    createUser: async ({ user }) => {
      const response = await circleServer.createUser({
        userId: user.id!, // The user ID is guaranteed to be present
      });

      // If the request fails, throw an error
      if (response.status != 201) throw new Error("Failed to create user");

      // Get the user details from the Circle API
      const userDetails = await circleServer.getUser({ userId: user.id! });

      // update the user in the database with the security question and pin status
      await db.user.update({
        where: { id: user.id! },
        data: {
          securityQuestionStatus:
            userDetails.data?.user?.securityQuestionStatus,
          pinStatus: userDetails.data?.user?.pinStatus,
          userCreated: true,
        },
      });
    },
  },
  callbacks: {
    // Add the wallet IDs, user created status, and pin status to the session
    session({ session, token }) {
      session.user.walletIds = token.walletIds as any;
      session.user.userCreated = token.userCreated as any;
      session.user.id = token.sub as any;
      session.user.pinStatus = token.pinStatus as any;
      return session;
    },

    // Add the user details to the JWT token
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await db.user.findUnique({
        where: { id: token.sub as string },
      });

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.sub = existingUser.id;
      token.walletIds = existingUser.walletIds;
      token.userCreated = existingUser.userCreated;
      token.pinStatus = existingUser.pinStatus;
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development", // Enable debug mode in development
  session: { strategy: "jwt" }, // Use JWT for session management
  secret: process.env.AUTH_SECRET, // Use the AUTH_SECRET environment variable as the secret
  ...authConfig,
});
