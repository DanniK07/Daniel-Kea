import Link from "next/link";
import styles from "./page.module.css";
import { Container } from "@/ui/components/Container";
import { listProducts } from "@/server/catalog/products.repo";
import { ProductGrid } from "@/features/shop/category/ProductGrid";

export const revalidate = 3600; // Revalidar cada hora

const CATEGORY_LABEL: Record<string, string> = {
  hombre: "Hombre",
  mujer: "Mujer",
};

export default async function ShopCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const label = CATEGORY_LABEL[category] ?? category;

  const products = await listProducts({ categorySlug: category });

  return (
    <main className={styles.main}>
      <Container>
        <header className={styles.header}>
          <div className={styles.kicker}>Shop</div>
          <h1 className={styles.title}>{label}</h1>
          <nav className={styles.subnav} aria-label="Categorías">
            <Link
              className={styles.subLink}
              data-active={category === "hombre"}
              href="/shop/hombre"
            >
              Hombre
            </Link>
            <Link
              className={styles.subLink}
              data-active={category === "mujer"}
              href="/shop/mujer"
            >
              Mujer
            </Link>
          </nav>
        </header>

        <ProductGrid products={products} />
      </Container>
    </main>
  );
}

