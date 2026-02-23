import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Card } from "@/ui/admin/Card";
import styles from "./page.module.css";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const [products, categories, users, orders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.order.count(),
  ]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.kicker}>Panel</div>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>
          Gestión editorial de catálogo · Acceso restringido
        </p>
      </header>

      <section className={styles.grid}>
        <Card>
          <div className={styles.cardTitle}>Productos</div>
          <div className={styles.cardValue}>{products}</div>
          <div className={styles.cardHint}>CRUD + publicación</div>
        </Card>
        <Card>
          <div className={styles.cardTitle}>Categorías</div>
          <div className={styles.cardValue}>{categories}</div>
          <div className={styles.cardHint}>Hombre / Mujer</div>
        </Card>
        <Card>
          <div className={styles.cardTitle}>Usuarios</div>
          <div className={styles.cardValue}>{users}</div>
          <div className={styles.cardHint}>Incluye admin</div>
        </Card>
        <Card>
          <div className={styles.cardTitle}>Pedidos</div>
          <div className={styles.cardValue}>{orders}</div>
          <div className={styles.cardHint}>Stripe-ready</div>
        </Card>
      </section>
    </>
  );
}
