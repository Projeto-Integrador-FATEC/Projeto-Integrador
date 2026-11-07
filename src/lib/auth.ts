import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { bearer } from "better-auth/plugins";
import { prisma } from "./prisma";

const SALT_ROUNDS = 10;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  advanced: {
    database: {
      generateId: "serial",
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: (password) => bcrypt.hash(password, SALT_ROUNDS),
      verify: ({ password, hash }) => bcrypt.compare(password, hash),
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Import dinâmico: modules -> auth.repository -> auth criaria import circular.
      void import("@/services/modules")
        .then(({ modules }) => modules.services.email.sendVerificationEmail(user, url))
        .catch((error) => console.error("Erro ao enviar e-mail de verificação:", error));
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "ALUNO",
        input: false,
      },
    },
  },
  plugins: [bearer(), nextCookies()],
});
