import { auth } from "@/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) throw new Error("User not logged in");

    const user = await db.user.findUnique({
      where: {
        id: session!.user.id,
      },
    });

    if (!user) throw new Error("User not logged in");

    return NextResponse.json(user);
  } catch (error: any) {
    console.log("[CURRENT_USER_API_ERROR]", error);
    return NextResponse.json(
      {
        error: error,
      },
      {
        status: 501,
      }
    );
  }
}
