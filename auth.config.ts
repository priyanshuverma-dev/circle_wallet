/**
 * This file is used to configure the authentication providers that will be used by NextAuth.
 * @file auth.config.ts
 */

import Github from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

// Export the providers array that will be used by NextAuth
export default {
  providers: [Github],
} satisfies NextAuthConfig;
