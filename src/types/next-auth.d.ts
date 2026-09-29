import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    token: string;
  }

  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];

    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    accessToken: string;
  }
}