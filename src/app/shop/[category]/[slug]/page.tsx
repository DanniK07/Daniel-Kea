import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { Container } from "@/ui/components/Container";
import { getProductBySlug } from "@/server/catalog/products.repo";
import { ProductClient } from "@/features/shop/product/ProductClient";

export const revalidate = 3600; // Revalidar cada hora

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; category: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className={styles.main}>
      <Container size="wide">
        <div className={styles.grid}>
          <div className={styles.gallery} aria-label="Galería de producto">
            <div className={styles.heroImage} role="img" aria-label="Imagen principal del producto" />
            <div className={styles.thumbs} role="list" aria-label="Imágenes adicionales">
              {product.images.slice(0, 3).map((_, idx) => (
                <div
                  key={idx}
                  className={styles.thumb}
                  role="listitem"
                  aria-label={`Imagen ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.detail}>
            <div className={styles.kicker}>{product.category.name}</div>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.price}>
              €{(product.priceCents / 100).toFixed(2)}
            </div>

            <ProductClient
              product={{
                id: product.id,
                name: product.title,
                price: product.priceCents / 100,
                sizes: product.sizes,
              }}
            />

            <div className={styles.section}>
              <h2 className={styles.h2}>Descripción</h2>
              <p className={styles.p}>{product.description}</p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.h2}>Detalles técnicos</h2>
              <dl className={styles.dl}>
                <div className={styles.row}>
                  <dt>Tejido</dt>
                  <dd>{product.fabric ?? "—"}</dd>
                </div>
                <div className={styles.row}>
                  <dt>Gramaje</dt>
                  <dd>{product.weightGsm ? `${product.weightGsm} gsm` : "—"}</dd>
                </div>
                <div className={styles.row}>
                  <dt>Corte</dt>
                  <dd>{product.fit ?? "—"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

