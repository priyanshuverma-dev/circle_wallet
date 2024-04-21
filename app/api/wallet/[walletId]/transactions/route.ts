import { auth } from "@/auth";
import circleServer from "@/lib/circle-server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { walletId: string } }
) {
  try {
    const walletId = params.walletId;
    const session = await auth();
    if (!session) throw new Error("Unauthenticated");

    const userId = session.user.id;
    const tokenRes = await circleServer.createUserToken({
      userId,
    });
    if (!tokenRes.data?.userToken) throw new Error("Error in fetching token");

    const transactionsLists = await circleServer.listTransactions({
      userToken: tokenRes.data.userToken,
      walletIds: [walletId],
      pageSize: 10,
    });

    if (!transactionsLists.data?.transactions)
      throw new Error("Error in fetching transations");

    const transactions = transactionsLists.data.transactions;

    return NextResponse.json(transactions);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
