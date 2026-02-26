"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./SiteHeader.module.css";
import { Container } from "@/ui/components/Container";
import { useCartStore } from "@/state/cartStore";
import { motion } from "framer-motion";

const EASE_MICRO = [0.18, 0.89, 0.32, 1] as [number, number, number, number];

export function SiteHeader() {
  const openCart = useCartStore((s) => s.openCart);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={styles.header} data-scrolled={scrolled ? "true" : "false"}>
      <Container>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label="Daniel Kéa">
            <span className={styles.brandWordmark}>Daniel</span>
            <span className={styles.brandAccent}>Kéa</span>
          </Link>

          <nav className={styles.nav} aria-label="Navegación principal">
            <Link className={styles.link} href="/shop">
              Shop
            </Link>
            <Link className={styles.link} href="/about">
              About
            </Link>
            <Link className={styles.link} href="/contact">
              Contact
            </Link>
          </nav>

          <div className={styles.actions}>
            <motion.button
              className={styles.cartButton}
              type="button"
              onClick={openCart}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16, ease: EASE_MICRO }}
            >
              Carrito
            </motion.button>
          </div>
        </div>
      </Container>
    </header>
  );
}

