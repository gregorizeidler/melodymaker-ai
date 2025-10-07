import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { env } from "~/env";

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:3000"],
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "adc1a0d5-3a97-4c21-acae-f35a897a51c2",
              slug: "small",
            },
            {
              productId: "005c7c8f-49da-49b6-a1e5-82bb5dc3ac48",
              slug: "medium",
            },
            {
              productId: "331b3426-d69c-4379-bec4-d8b7c60f1c58",
              slug: "large",
            },
          ],
          successUrl: "/",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (order) => {
            const externalCustomerId = order.data.customer.externalId;
            if (!externalCustomerId) {
              console.error("No external customer ID found for order");
              throw new Error("No external customer ID found");
            }

            const productId = order.data.productId;
            let creditsToAdd = 0;

            switch (productId) {
              case "adc1a0d5-3a97-4c21-acae-f35a897a51c2": // small
                creditsToAdd = 10;
                break;
              case "005c7c8f-49da-49b6-a1e5-82bb5dc3ac48": // medium
                creditsToAdd = 25;
                break;
              case "331b3426-d69c-4379-bec4-d8b7c60f1c58": // large
                creditsToAdd = 50;
                break;
            }

            await db.user.update({
              where: { id: externalCustomerId },
              data: {
                credits: {
                  increment: creditsToAdd,
                },
              },
            });
          },
        }),
      ],
    }),
  ],
});
