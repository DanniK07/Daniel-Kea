import { ReactNode } from "react";
import { AdminLayout } from "@/ui/admin/AdminLayout";

export default function AdminLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  // El pathname se obtiene del middleware via header
  // Por ahora usamos una solución simple
  return <AdminLayout>{children}</AdminLayout>;
}
