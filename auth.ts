import LoginService from "@/services/get-user-service"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { pages } from "next/dist/build/templates/app-page"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null

        const response = await LoginService(credentials.email as string, credentials.password as string)

        user = response.data
        if (!user) {
          throw new Error("Invalid credentials.")
        }
        
        return user
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // redireciona sempre para a dashboard
      return "/";
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
})