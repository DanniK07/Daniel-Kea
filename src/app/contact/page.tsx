import styles from "./page.module.css";
import { Container } from "@/ui/components/Container";

export default function ContactPage() {
  return (
    <main className={styles.main}>
      <Container>
        <header className={styles.header}>
          <div className={styles.kicker}>Contacto</div>
          <h1 className={styles.title}>Atelier & prensa</h1>
          <p className={styles.subtitle}>
            Escríbenos para colaboraciones, prensa o atención al cliente.
          </p>
        </header>

        <section className={styles.body}>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.label}>Email</span>
              <span>contacto@danielkea.local</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Ciudad</span>
              <span>—</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Horario</span>
              <span>L–V · 10:00–18:00</span>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}

