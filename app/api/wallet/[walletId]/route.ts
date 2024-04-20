import { auth } from "@/auth";
import circleServer from "@/lib/circle-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { walletId: string } }
) {
  try {
    const walletId = params.walletId;

    if (!walletId || walletId == "null") throw new Error("WalletId required");

    const session = await auth();

    if (!session) throw new Error("Unauthenticated");

    const userAccess = await circleServer.createUserToken({
      userId: session.user.id,
    });

    if (!userAccess.data?.userToken)
      throw new Error("Error in creating session");

    const wallets = await circleServer.listWallets({
      userToken: userAccess.data?.userToken,
    });

    const coins = await circleServer.getWalletTokenBalance({
      walletId,
      userToken: userAccess.data.userToken,
    });

    if (!wallets.data?.wallets) {
      return NextResponse.json(
        { message: "Wallet not found" },
        { status: 404 }
      );
    }
    const wallet = wallets.data.wallets.find((w) => w.id == walletId);

    return NextResponse.json({
      wallet,
      tokens: coins.data?.tokenBalances,
    });
  } catch (error: any) {
    console.log("ERROR_APIIII", error);
    return NextResponse.json({ error: error.message }, { status: 501 });
  }
}
