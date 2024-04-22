/**
 * @api {get} /wallet/create Create Wallet
 * @api {post} /wallet/create Create Wallet
 * @apiName CreateWallet
 * @apiGroup Wallet
 * @apiDescription This API route is responsible for creating a new wallet.
 */

import { auth } from "@/auth";
import circleServer from "@/lib/circle-server";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth(); // get the session from the auth function
    if (!session) throw new Error("Unauthenticated"); // throw an error if the session is null

    const userId = session.user.id; // get the user id from the session

    // create a new user token from circle server
    const userAccess = await circleServer.createUserToken({
      userId,
    });

    // throw an error if the user token is null
    if (!userAccess.data?.userToken)
      throw new Error("Error in creating session");

    // create a new wallet from circle server
    const newWallet = await circleServer.createWallet({
      blockchains: ["ETH-SEPOLIA"],
      accountType: "SCA",
      userId: userId,
    });

    // throw an error if the challenge id is null
    return NextResponse.json({
      challengeId: newWallet.data?.challengeId,
      userToken: userAccess.data.userToken,
      encryptionKey: userAccess.data.encryptionKey,
    });
  } catch (error: any) {
    // catch the error and log the error
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth(); // get the session from the auth function
    if (!session) throw new Error("Unauthenticated"); // throw an error if the session is null

    // create a new user token from circle server
    const userAccess = await circleServer.createUserToken({
      userId: session.user.id,
    });

    // throw an error if the user token is null
    if (!userAccess.data?.userToken) {
      throw new Error("Error in creating session");
    }

    // get the wallets from circle server
    const wallets = await circleServer.listWallets({
      userToken: userAccess.data?.userToken,
    });

    // get the wallet ids from the wallets
    const walletIds = wallets.data?.wallets?.map((wallet) => wallet.id);

    // update the user in the db with walletIds
    await db.user.update({
      where: { id: session.user.id },
      data: {
        walletIds,
      },
    });

    // return the success message
    return NextResponse.json({ message: "wallet added." });
  } catch (error: any) {
    // catch the error and log the error
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
