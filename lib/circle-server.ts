/**
 * This file exports the Circle API client.
 * It is used to create a new Circle API client.
 */

import { initiateUserControlledWalletsClient } from "@circle-fin/user-controlled-wallets";
import env from "./env";

// Create a new Circle API client
const circleServer = initiateUserControlledWalletsClient({
  apiKey: env.NEXT_PUBLIC_CIRCLE_API_KEY,
});

// Export the Circle API client
export default circleServer;
