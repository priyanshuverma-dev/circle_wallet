import { auth } from "@/auth";
import circleServer from "@/lib/circle-server";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userAccess = await circleServer.createUserToken({
      userId: session.user.id,
    });

    if (!userAccess.data?.userToken) {
      return NextResponse.json(
        { error: "Failed to create user token. Try Again" },
        { status: 500 }
      );
    }

    const pinAlreadyExists = await circleServer.getUserStatus({
      userToken: userAccess.data.userToken,
    });

    if (pinAlreadyExists.data?.pinStatus == "ENABLED") {
      const wallets = await circleServer.listWallets({
        userToken: userAccess.data?.userToken,
      });

      const walletIds = wallets.data?.wallets?.map((wallet) => wallet.id);

      await db.user.update({
        where: { id: session.user.id },
        data: {
          pinStatus: "ENABLED",
          securityQuestionStatus: "ENABLED",
          walletIds,
        },
      });
      return NextResponse.json({ message: "Pin and wallet added." });
    }

    const challengId = await circleServer.createUserPinWithWallets({
      userId: session.user.id,
      blockchains: ["ETH-SEPOLIA"],
      accountType: "SCA",
    });

    if (!challengId.data?.challengeId) {
      return NextResponse.json(
        { error: "Failed to create pin. Try Again" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      challengeId: challengId.data.challengeId,
      userToken: userAccess.data.userToken,
      encryptionKey: userAccess.data.encryptionKey,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userAccess = await circleServer.createUserToken({
      userId: session.user.id,
    });

    if (!userAccess.data?.userToken) {
      throw new Error("Error in creating session");
    }

    // challengeId.data?.challenge?.status
    const wallets = await circleServer.listWallets({
      userToken: userAccess.data.userToken,
    });

    const walletIds = wallets.data?.wallets?.map((wallet) => wallet.id);

    console.log(walletIds);

    await db.user.update({
      where: { id: session.user.id },
      data: {
        pinStatus: "ENABLED",
        securityQuestionStatus: "ENABLED",
        walletIds,
      },
    });

    return NextResponse.json({ message: "Pin and wallet added." });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
