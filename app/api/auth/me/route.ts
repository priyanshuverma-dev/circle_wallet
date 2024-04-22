/**
 * @api {get} /auth/me Get Current User
 * @apiName GetCurrentUser
 * @apiGroup Auth
 * @apiDescription This API route is responsible for getting the current user data.
 */

import { auth } from "@/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// This is a dynamic route setting for vercel deployment
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth(); // get the session from the auth function
    if (!session) throw new Error("User not logged in"); // throw an error if the session is null

    // get the user data from the db
    const user = await db.user.findUnique({
      where: {
        id: session!.user.id,
      },
    });

    // throw an error if the user is null
    if (!user) throw new Error("User not logged in");

    return NextResponse.json(user); // return the user data
  } catch (error: any) {
    // catch the error and log the error
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
