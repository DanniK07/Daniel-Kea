import styles from "./page.module.css";
import { Container } from "@/ui/components/Container";

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <Container>
        <header className={styles.header}>
          <div className={styles.kicker}>La casa</div>
          <h1 className={styles.title}>Daniel Kéa</h1>
          <p className={styles.subtitle}>
            Un estudio contemporáneo: proporción editorial, materiales honestos y
            una estética de lujo silencioso.
          </p>
        </header>

        <section className={styles.body}>
          <p>
            Diseñamos piezas que se sostienen en el tiempo. Cada colección se construye
            con ritmo, espacio en blanco y un corte que evita lo obvio.
          </p>
          <p>
            Negro profundo, marfil y grises cálidos: una paleta sobria para resaltar la
            textura, la caída y la arquitectura de la prenda.
          </p>
        </section>
      </Container>
    </main>
  );
}

