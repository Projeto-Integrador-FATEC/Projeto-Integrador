import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { modules } from "@/services/modules"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        const user = await modules.services.user.authenticate(
          credentials.email as string,
          credentials.password as string
        )

        if (!user) {
          return null
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
})
