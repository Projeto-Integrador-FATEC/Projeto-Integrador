import LoginService from "@/services/get-user-service"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { pages } from "next/dist/build/templates/app-page"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
        console.log("credentialssssssssss", credentials)
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
  },
  pages: {
    signIn: "/login",
  },
})