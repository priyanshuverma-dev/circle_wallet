import { auth } from "@/auth";
import circleServer from "@/lib/circle-server";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { walletId: string } }
) {
  try {
    const walletId = params.walletId;
    const { fromAddress, tokenId, amount, destinationAddress, name } =
      await request.json();

    const session = await auth();
    if (!session) throw new Error("Unauthenticated");

    const userId = session.user.id;

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user) {
      const existingContactIndex = user.contacts.findIndex(
        (contact) => contact.address === destinationAddress
      );

      if (existingContactIndex === -1) {
        // Contact doesn't exist, add it to the contacts array
        const updatedContacts = [
          ...user.contacts,
          { address: destinationAddress, name },
        ];

        // Update the user record in the database with the updated contacts array
        await db.user.update({
          where: { id: userId },
          data: {
            contacts: updatedContacts,
          },
        });
      }
    }

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
