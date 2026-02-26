import { Container } from "@/ui/components/Container";
import styles from "./page.module.css";
import { HomeHero } from "@/features/home/ui/HomeHero";
import { HomeProductGrid } from "@/features/home/ui/HomeProductGrid";
import { listProducts } from "@/server/catalog/products.repo";

export const revalidate = 3600; // Revalidar cada hora

export default async function Home() {
  const products = await listProducts();

  return (
    <main className={styles.main}>
      <Container>
        <div className={styles.top}>
          <HomeHero />
        </div>
      </Container>

      <section className={styles.editorial}>
        <Container>
          <div className={styles.column}>
            <h2 className={styles.h2}>Editorial</h2>
            <p className={styles.p}>
              Espacio, ritmo y proporción. Diseñamos para que cada prenda hable en
              voz baja: sin ruido visual, sin artificios.
            </p>
          </div>
          <div className={styles.column}>
            <h2 className={styles.h2}>Material</h2>
            <p className={styles.p}>
              Tejidos seleccionados por su caída y tacto. Una estética de contrastes:
              negro profundo, blanco marfil, gris suave.
            </p>
          </div>
          <div className={styles.column}>
            <h2 className={styles.h2}>Hecho para durar</h2>
            <p className={styles.p}>
              Construcción limpia. Detalles invisibles. Acabados que resisten el
              tiempo.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <HomeProductGrid products={products} />
      </Container>

      <section className={styles.newsletter}>
        <Container>
          <div className={styles.newsHeader}>
            <div className={styles.kicker}>Newsletter</div>
            <h2 className={styles.newsTitle}>Notas de atelier</h2>
            <p className={styles.newsText}>
              Lanzamientos, editoriales y piezas limitadas. Sin ruido.
            </p>
          </div>
          <form className={styles.newsForm} aria-label="Formulario de suscripción">
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={styles.newsInput}
              type="email"
              placeholder="tu@email.com"
              required
              aria-required="true"
            />
            <button className={styles.newsButton} type="submit" aria-label="Suscribirse al newsletter">
              Suscribirme
            </button>
          </form>
        </Container>
      </section>
    </main>
  );
}
