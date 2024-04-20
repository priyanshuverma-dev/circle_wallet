import circleServer from "@/lib/circle-server";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      throw new Error("Missing userId");
    }
    const response = await circleServer.createUser({
      userId,
    });

    if (response.status != 201) throw new Error("Failed to create user");

    const userDetails = await circleServer.getUser({ userId });

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        securityQuestionStatus: userDetails.data?.user?.securityQuestionStatus,
        pinStatus: userDetails.data?.user?.pinStatus,
        userCreated: true,
      },
    });

    return NextResponse.json({
      message: "User created",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
