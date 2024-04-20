import { initiateUserControlledWalletsClient } from "@circle-fin/user-controlled-wallets";
import env from "./env";

const circleServer = initiateUserControlledWalletsClient({
  apiKey: env.NEXT_PUBLIC_CIRCLE_API_KEY,
});

export default circleServer;
