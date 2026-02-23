import { NextResponse } from "next/server";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/lib/validation/schemas";
import { handleError, ValidationError } from "@/lib/errors/handler";
import { checkRateLimit, getClientIdentifier } from "@/lib/rateLimit/simple";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Rate limiting: 5 intentos por 15 minutos
    const identifier = getClientIdentifier(req);
    const rateLimit = checkRateLimit(identifier, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Demasiados intentos. Por favor, espera antes de intentar de nuevo.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          },
        },
      );
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Credenciales inválidas", parsed.error.errors);
    }

    // Nota: NextAuth maneja el login, pero este endpoint puede usarse para validación adicional
    // Por ahora, devolvemos un error ya que NextAuth maneja el login en su propio endpoint
    return NextResponse.json(
      { error: "Usa el endpoint de NextAuth para login" },
      { status: 400 },
    );
  } catch (error) {
    const handled = handleError(error);
    return NextResponse.json(
      { error: handled.message, ...(handled.details ? { details: handled.details } : {}) },
      { status: handled.statusCode },
    );
  }
}
