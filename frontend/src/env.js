import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),

    BETTER_AUTH_SECRET: z.string(),

    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    MODAL_KEY: z.string(),
    MODAL_SECRET: z.string(),

    B2_BUCKET_NAME: z.string(),
    B2_KEY_ID: z.string(),
    B2_APP_KEY: z.string(),
    B2_ENDPOINT: z.string().url(),

    GENERATE_WITH_LYRICS: z.string(),
    GENERATE_FROM_DESCRIBED_LYRICS: z.string(),
    GENERATE_FROM_DESCRIPTION: z.string(),

    POLAR_ACCESS_TOKEN: z.string(),
    POLAR_WEBHOOK_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

    NODE_ENV: process.env.NODE_ENV,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    MODAL_KEY: process.env.MODAL_KEY,
    MODAL_SECRET: process.env.MODAL_SECRET,

    B2_BUCKET_NAME: process.env.B2_BUCKET_NAME,
    B2_KEY_ID: process.env.B2_KEY_ID,
    B2_APP_KEY: process.env.B2_APP_KEY,
    B2_ENDPOINT: process.env.B2_ENDPOINT,

    GENERATE_WITH_LYRICS: process.env.GENERATE_WITH_LYRICS,
    GENERATE_FROM_DESCRIBED_LYRICS: process.env.GENERATE_FROM_DESCRIBED_LYRICS,
    GENERATE_FROM_DESCRIPTION: process.env.GENERATE_FROM_DESCRIPTION,

    POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
    POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
