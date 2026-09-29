import LoginService from "@/services/get-user-service"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        const response = await LoginService(
          credentials.email as string,
          credentials.password as string
        )

        const user = response.data

        if (!user) {
          throw new Error("Invalid credentials.")
        }

        return user
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.role = user.role
        token.accessToken = user.token
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string
        session.user.role = token.role as string
      }

      session.accessToken = token.accessToken as string

      return session
    },

    async redirect({ baseUrl }) {
      return baseUrl
    },
  },

  pages: {
    signIn: "/login",
  },
})