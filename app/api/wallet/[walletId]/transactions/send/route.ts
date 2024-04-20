import { auth } from "@/auth";
import circleServer from "@/lib/circle-server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { walletId: string } }
) {
  try {
    const walletId = params.walletId;
    const { fromAddress, tokenId, amount, destinationAddress } =
      await request.json();

    const session = await auth();
    if (!session) throw new Error("Unauthenticated");

    const userId = session.user.id;

    const tokenRes = await circleServer.createUserToken({
      userId,
    });
    if (!tokenRes.data?.userToken) throw new Error("Error in fetching token");

    const createTransaction = await circleServer.createTransaction({
      userToken: tokenRes.data.userToken,
      amounts: [`${amount}`],
      destinationAddress: destinationAddress,
      tokenId: tokenId,
      walletId: walletId,
      fee: {
        type: "level",
        config: {
          feeLevel: "MEDIUM",
        },
      },
    });

    if (!createTransaction.data?.challengeId)
      throw new Error("Error in creating transaction");

    return NextResponse.json({
      challengeId: createTransaction.data.challengeId,
      userToken: tokenRes.data.userToken,
      encryptionKey: tokenRes.data.encryptionKey,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
