import { Suspense } from "react";
import styles from "./page.module.css";
import { Container } from "@/ui/components/Container";
import { LoginForm } from "@/features/admin/auth/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className={styles.main}>
      <Container>
        <div className={styles.shell}>
          <div className={styles.header}>
            <div className={styles.kicker}>Acceso privado</div>
            <h1 className={styles.title}>Admin · Daniel Kéa</h1>
            <p className={styles.subtitle}>
              Inicia sesión con tus credenciales para acceder al panel.
            </p>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}

