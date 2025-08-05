import { Role } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { revalidatePath } from "next/cache";
import { getUser } from "./app/actions/user";
import { db } from "./db";
import { verifyPassword } from "./lib/utils";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: Role | null;
      phone?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role | null;
    phone?: string | null;
  }
}

// Extend JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: Role | null;
    phone?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Email/Password authentication
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await getUser(credentials.email as string);

        if (!user) {
          // No user found, but we don't want to reveal that for security reasons.
          // Returning null is the standard way to indicate failed authentication.
          return null;
        }

        if (!user.password) {
          // This user likely uses a social provider
          return null;
        }

        const isPasswordValid = await verifyPassword(
          credentials.password as string,
          user.password as string
        );

        if (!isPasswordValid) {
          return null;
        }

        revalidatePath("/");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        };
      },
    }),
    // WhatsApp/Phone authentication
    Credentials({
      id: "whatsapp",
      name: "WhatsApp",
      credentials: {
        phone: { label: "Phone", type: "text" },
        verified: { label: "Verified", type: "text" }, // This will be set to "true" after OTP verification
      },
      authorize: async (credentials) => {
        if (!credentials?.phone || credentials.verified !== "true") {
          return null;
        }

        const user = await db.user.findUnique({
          where: { phone: credentials.phone as string },
        });

        if (!user) {
          return null;
        }

        revalidatePath("/");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.phone = user.phone;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
});
