"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./HomeHero.module.css";

const EASE_LUX = [0.16, 1, 0.3, 1] as [number, number, number, number];
const EASE_MICRO = [0.18, 0.89, 0.32, 1] as [number, number, number, number];

export function HomeHero() {
  return (
    <motion.section
      className={styles.hero}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_LUX }}
    >
      <div className={styles.content}>
        <motion.div
          className={styles.text}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_LUX }}
        >
          <div className={styles.kicker}>Colección 01 · Atelier Edition</div>
          <h1 className={styles.title}>
            Siluetas precisas,
            <br />
            lujo silencioso.
          </h1>
          <p className={styles.lede}>
            Daniel Kéa explora el minimalismo editorial con una paleta sobria,
            texturas honestas y un corte impecable.
          </p>
          <div className={styles.ctas}>
            <motion.span
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE_MICRO }}
            >
              <Link className={styles.primary} href="/shop">
                Explorar Shop
              </Link>
            </motion.span>
            <motion.span
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE_MICRO }}
            >
              <Link className={styles.secondary} href="/about">
                Conocer la casa
              </Link>
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE_LUX }}
        >
          <div className={styles.imagePlaceholder} aria-hidden="true" />
        </motion.div>
      </div>
    </motion.section>
  );
}

