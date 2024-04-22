/**
 * This file is a middleware that will be executed before each request.
 * It checks if the user is authenticated and redirects to the login page if not.
 * It also checks if the user is trying to access an API route and allows it.
 * @file middleware.ts
 */

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

// Create a instance of NextAuth
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req; // Get the next URL from the request object
  const isLoggedIn = !!req.auth; // Check if the user is logged in

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix); // Check if the user is trying to access an API route
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname); // Check if the user is trying to access a public route
  const isAuthRoute = authRoutes.includes(nextUrl.pathname); // Check if the user is trying to access an auth route

  // If the user is trying to access an API route, allow it
  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    // If the user is logged in and trying to access an auth route, redirect to the default login redirect
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // If the user is not logged in and trying to access a private route, redirect to the login page
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return;
});

// Export the config object that will be used by the middleware to watch for changes
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
