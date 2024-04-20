import { auth } from "@/auth";
import circleServer from "@/lib/circle-server";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthenticated");

    const userId = session.user.id;
    const userAccess = await circleServer.createUserToken({
      userId,
    });

    if (!userAccess.data?.userToken)
      throw new Error("Error in creating session");

    const newWallet = await circleServer.createWallet({
      blockchains: ["ETH-SEPOLIA"],
      accountType: "SCA",
      userId: userId,
    });

    return NextResponse.json({
      challengeId: newWallet.data?.challengeId,
      userToken: userAccess.data.userToken,
      encryptionKey: userAccess.data.encryptionKey,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {} = await req.json();

    const userAccess = await circleServer.createUserToken({
      userId: session.user.id,
    });

    if (!userAccess.data?.userToken) {
      throw new Error("Error in creating session");
    }

    // challengeId.data?.challenge?.status
    const wallets = await circleServer.listWallets({
      userToken: userAccess.data?.userToken,
    });

    const walletIds = wallets.data?.wallets?.map((wallet) => wallet.id);

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        walletIds,
      },
    });

    return NextResponse.json({ message: "wallet added." });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
