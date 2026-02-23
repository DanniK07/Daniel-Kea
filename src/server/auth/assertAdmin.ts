import { redirect } from "next/navigation";
import { getSession } from "./session";
import { ForbiddenError } from "@/lib/errors/handler";

/**
 * Verifica que el usuario esté autenticado y tenga rol ADMIN.
 * Redirige si no está autenticado, lanza error si no es admin.
 */
export async function assertAdmin() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/admin/login");
  }
  if (session.user.role !== "ADMIN") {
    throw new ForbiddenError("Acceso restringido a administradores");
  }
}

/**
 * Verifica que el usuario esté autenticado y tenga rol ADMIN.
 * Retorna boolean en lugar de redirigir (útil para API routes).
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.user?.role === "ADMIN";
}

