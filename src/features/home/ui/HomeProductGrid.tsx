"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./HomeProductGrid.module.css";

const EASE_EDITORIAL = [0.2, 0.8, 0.2, 1] as [number, number, number, number];

export type HomeProductDTO = {
  id: string;
  title: string;
  slug: string;
  priceCents: number;
  category: { slug: string; name: string };
};

type Props = {
  products: HomeProductDTO[];
};

export const HomeProductGrid = memo(function HomeProductGrid({
  products,
}: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.kicker}>Colección destacada</div>
        <h2 className={styles.h2}>Piezas esenciales</h2>
      </div>

      <motion.div
        className={styles.grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.09 } },
        }}
      >
        {products.slice(0, 6).map((p) => (
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
              <div className={styles.image} aria-hidden="true" />
              <div className={styles.cardBody}>
                <div className={styles.title}>{p.title}</div>
                <div className={styles.meta}>
                  <span>€{(p.priceCents / 100).toFixed(2)}</span>
                  <span className={styles.dot} aria-hidden="true">
                    ·
                  </span>
                  <span>{p.category.name}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
});

