import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { users } from "@/lib/data";

declare module "next-auth" {
  interface User {
    role?: string;
    employeeId?: string;
    department?: string;
    position?: string;
  }
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      employeeId?: string;
      department?: string;
      position?: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string;
    employeeId?: string;
    department?: string;
    position?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        );
        if (user) {
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId,
            department: user.department,
            position: user.position,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.employeeId = user.employeeId;
        token.department = user.department;
        token.position = user.position;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).employeeId = token.employeeId;
        (session.user as any).department = token.department;
        (session.user as any).position = token.position;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET || "hris-demo-secret-key-for-portfolio-2026",
});
