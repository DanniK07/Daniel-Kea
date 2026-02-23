"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Container } from "@/ui/components/Container";
import styles from "./AdminLayout.module.css";

type Props = {
  children: ReactNode;
};

export function AdminLayout({ children }: Props) {
  const currentPath = usePathname();
  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.brand}>
            <span className={styles.brandWordmark}>Daniel</span>
            <span className={styles.brandAccent}>Kéa</span>
          </Link>
          <div className={styles.kicker}>Admin</div>
        </div>

        <nav className={styles.nav} aria-label="Navegación admin">
          <Link
            href="/admin"
            className={styles.navLink}
            data-active={currentPath === "/admin"}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className={styles.navLink}
            data-active={currentPath?.startsWith("/admin/products")}
          >
            Productos
          </Link>
          <Link
            href="/admin/categories"
            className={styles.navLink}
            data-active={currentPath?.startsWith("/admin/categories")}
          >
            Categorías
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.navLink}>
            Ver sitio
          </Link>
          <button
            type="button"
            className={styles.navLink}
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
          >
            Salir
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Container>{children}</Container>
      </main>
    </div>
  );
}
