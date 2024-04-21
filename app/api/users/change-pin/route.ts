import { auth } from "@/auth";
import circleServer from "@/lib/circle-server";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthenticated");

    const userId = session.user.id;

    const tokenResponse = await circleServer.createUserToken({
      userId,
    });

    if (!tokenResponse.data?.userToken)
      throw new Error("Failed to create user token");

    const res = await circleServer.updateUserPin({
      userToken: tokenResponse.data?.userToken,
    });

    if (!res.data?.challengeId) throw new Error("Failed to create challengId");

    return NextResponse.json({
      challengeId: res.data.challengeId,
      userToken: tokenResponse.data.userToken,
      encryptionKey: tokenResponse.data.encryptionKey,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
