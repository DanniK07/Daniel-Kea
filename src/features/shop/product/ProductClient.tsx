"use client";

import { useMemo, useState } from "react";
import * as Select from "@radix-ui/react-select";
import styles from "./ProductClient.module.css";
import { useCartStore } from "@/state/cartStore";
import { AnimatePresence, motion } from "framer-motion";

const EASE_MICRO = [0.18, 0.89, 0.32, 1] as [number, number, number, number];

type ProductClientProps = {
  product: {
    id: string;
    name: string;
    price: number;
    sizes: string[];
  };
};

export function ProductClient({ product }: ProductClientProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [size, setSize] = useState(product.sizes?.[0] ?? "");

  const disabled = useMemo(
    () => product.sizes.length > 0 && !size,
    [product.sizes.length, size],
  );

  return (
    <div className={styles.buy}>
      <div className={styles.controls}>
        <div className={styles.control}>
          <div className={styles.label}>Talla</div>
          <Select.Root value={size} onValueChange={setSize}>
            <Select.Trigger className={styles.trigger} aria-label="Seleccionar talla">
              <Select.Value placeholder="Selecciona" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className={styles.content} position="popper">
                <Select.Viewport className={styles.viewport}>
                  {product.sizes.map((s) => (
                    <Select.Item key={s} value={s} className={styles.item}>
                      <Select.ItemText>{s}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      <motion.button
        className={styles.add}
        type="button"
        disabled={disabled}
        onClick={() =>
          addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            size: size || undefined,
          })
        }
        aria-label={
          disabled
            ? "Selecciona una talla para añadir al carrito"
            : `Añadir ${product.name} al carrito`
        }
        whileHover={{ y: -1, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.16, ease: EASE_MICRO }}
      >
        Añadir al carrito
      </motion.button>

      <AnimatePresence>
        {disabled && (
          <motion.div
            className={styles.hint}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: EASE_MICRO }}
          >
            Selecciona una talla.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

