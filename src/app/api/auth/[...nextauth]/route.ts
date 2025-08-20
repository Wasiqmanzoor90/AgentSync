import { PrismaClient } from "@prisma/client";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

const authoptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    GoogleProvider({
           clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: { user: any }) {
      const email = user.email;

      try {
        const dbuser = await prisma.user.findUnique({
          where: { email },
        });

        if (!dbuser) {
          await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              password: "", // Use "" or make it nullable in schema
            },
          });
        }

        // You could store the token in session or return it client-side
        const jwtToken = Jwt.sign(
          {
              id: dbuser?.id, // This is the correct UUID
            email: user.email,
            name: user.name,
          },
          process.env.JWT_SECRET || "",
          { expiresIn: "7d" }
        );

         const cookieStore = await cookies();
        cookieStore.set("token", jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
        });

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async redirect({ baseUrl }: { baseUrl: string }) {
      return `${baseUrl}/pages/chat`;
    },
  },
};

const handler = NextAuth(authoptions);
export { handler as GET, handler as POST };
