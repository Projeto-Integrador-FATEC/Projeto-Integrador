import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.role = user.role
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string
        session.user.role = token.role as string
      }

      return session
    },

    async redirect({ baseUrl }) {
      return baseUrl
    },
  },

  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig
