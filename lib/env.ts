import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_CIRCLE_API_KEY: z.string({
    required_error: "NEXT_PUBLIC_CIRCLE_API_KEY is required in .env file",
  }),
  NEXT_PUBLIC_CIRCLE_APP_ID: z.string({
    required_error: "NEXT_PUBLIC_CIRCLE_APP_ID is required in .env file",
  }),
  BASE_URL: z.string({
    required_error: "BASE_URL is required in .env file",
  }),
  AUTH_GITHUB_ID: z.string({
    required_error: "AUTH_GITHUB_ID is required in .env file",
  }),
  AUTH_GITHUB_SECRET: z.string({
    required_error: "AUTH_GITHUB_SECRET is required in .env file",
  }),
});

const env = envSchema.parse(process.env);

export default env;
