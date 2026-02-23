"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "@/app/shop/[category]/page.module.css";

const EASE_EDITORIAL = [0.2, 0.8, 0.2, 1] as [number, number, number, number];

export type ProductCardDTO = {
  id: string;
  title: string;
  slug: string;
  priceCents: number;
  category: { slug: string; name: string };
};

type Props = {
  products: ProductCardDTO[];
};

export const ProductGrid = memo(function ProductGrid({ products }: Props) {
  return (
    <motion.section
      className={styles.grid}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {products.map((p) => (
        <motion.div
          key={p.id}
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, ease: EASE_EDITORIAL },
            },
          }}
        >
          <Link
            className={styles.card}
            href={`/shop/${p.category.slug}/${p.slug}`}
            aria-label={`Ver ${p.title} - €${(p.priceCents / 100).toFixed(2)}`}
          >
            <div className={styles.cardTop}>
              <div className={styles.image} aria-hidden="true" />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>{p.title}</div>
              <div className={styles.cardMeta}>
                <span>€{(p.priceCents / 100).toFixed(2)}</span>
                <span className={styles.dot} aria-hidden="true">
                  ·
                </span>
                <span className={styles.cardCategory}>{p.category.name}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.section>
  );
});

