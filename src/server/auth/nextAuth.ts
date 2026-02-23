import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { loginSchema } from "@/lib/validation/schemas";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/server/auth/password";
import { checkRateLimit, getClientIdentifier } from "@/lib/rateLimit/simple";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Rate limiting básico: 5 intentos por 15 minutos
        if (req) {
          const identifier = getClientIdentifier(req as unknown as Request);
          const rateLimit = checkRateLimit(identifier, {
            maxRequests: 5,
            windowMs: 15 * 60 * 1000,
          });

          if (!rateLimit.allowed) {
            throw new Error("Demasiados intentos. Por favor, espera antes de intentar de nuevo.");
          }
        }

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user?.hashedPassword) return null;

        const ok = await verifyPassword(parsed.data.password, user.hashedPassword);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      if (user?.id) token.sub = user.id;

      // Attach role (fetch once we have a user id)
      if (token.sub && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        token.role = dbUser?.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
      }
      return session;
    },
  },
};

