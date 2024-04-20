import { auth } from "@/auth";
import circleServer from "@/lib/circle-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthenticated");

    const userId = session.user.id;
    const tokenRes = await circleServer.createUserToken({
      userId,
    });
    if (!tokenRes.data?.userToken) throw new Error("Error in fetching token");

    const transactionsLists = await circleServer.listTransactions({
      userToken: tokenRes.data.userToken,
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
