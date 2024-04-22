/**
 * This file contains all the schemas used in the application
 * @file lib/schemas.ts
 * This file is self explanatory.
 */

import { z } from "zod";

export const sendFormSchema = z.object({
  destinationAddress: z.string().min(3, {
    message: "Destination address is required",
  }),
  name: z.string().optional(),
  fromAddress: z.string(),
  tokenId: z.string().min(1, {
    message: "Token is required",
  }),
  amount: z.coerce.number().gt(0, {
    message: "Amount should be greater then 0",
  }),
});
