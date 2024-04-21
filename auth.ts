import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import db from "./lib/db";
import circleServer from "./lib/circle-server";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  events: {
    createUser: async ({ user }) => {
      const response = await circleServer.createUser({
        userId: user.id!,
      });

      if (response.status != 201) throw new Error("Failed to create user");

      const userDetails = await circleServer.getUser({ userId: user.id! });

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
    session({ session, token }) {
      session.user.walletIds = token.walletIds as any;
      session.user.userCreated = token.userCreated as any;
      session.user.id = token.sub as any;
      session.user.pinStatus = token.pinStatus as any;
      return session;
    },
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
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  ...authConfig,
});
