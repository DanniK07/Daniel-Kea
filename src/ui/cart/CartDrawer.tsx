"use client";

import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/state/cartStore";
import styles from "./CartDrawer.module.css";

const EASE_EDITORIAL = [0.2, 0.8, 0.2, 1] as [number, number, number, number];
const EASE_LUX = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function CartDrawer() {
  const { open, closeCart, items, removeItem, setQuantity, clear } =
    useCartStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  async function handleCheckout() {
    if (items.length === 0) return;

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: "EUR",
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            size: item.size,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar el checkout");
      }

      // Redirigir a la URL de checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      setCheckoutError(message);
      setCheckoutLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && closeCart()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE_EDITORIAL }}
            >
              <Dialog.Overlay className={styles.overlay} />
            </motion.div>
          </Dialog.Portal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <motion.aside
              className={styles.panel}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: EASE_LUX }}
            >
              <Dialog.Content className={styles.content}>
                <header className={styles.header}>
                  <Dialog.Title className={styles.title}>
                    Carrito
                  </Dialog.Title>
                  <Dialog.Close className={styles.close} aria-label="Cerrar">
                    Cerrar
                  </Dialog.Close>
                </header>

                <div className={styles.body}>
                  {items.length === 0 ? (
                    <p className={styles.empty}>
                      Aún no has añadido ninguna pieza.
                    </p>
                  ) : (
                    <ul className={styles.list}>
                      {items.map((item) => (
                        <li
                          key={`${item.id}:${item.size ?? ""}`}
                          className={styles.item}
                        >
                          <div className={styles.itemMeta}>
                            <span className={styles.itemName}>{item.name}</span>
                            {item.size && (
                              <span className={styles.itemDetail}>
                                Talla {item.size}
                              </span>
                            )}
                          </div>
                          <div className={styles.itemRight}>
                            <span className={styles.itemPrice}>
                              €{(item.price * item.quantity).toFixed(2)}
                            </span>
                            <div className={styles.itemQty}>
                              <button
                                className={styles.qtyBtn}
                                type="button"
                                aria-label="Reducir cantidad"
                                onClick={() =>
                                  setQuantity(
                                    item.id,
                                    item.size,
                                    Math.max(0, item.quantity - 1),
                                  )
                                }
                              >
                                –
                              </button>
                              <span className={styles.qtyValue}>
                                {item.quantity}{" "}
                                <span className={styles.itemUnit}>ud</span>
                              </span>
                              <button
                                className={styles.qtyBtn}
                                type="button"
                                aria-label="Aumentar cantidad"
                                onClick={() =>
                                  setQuantity(item.id, item.size, item.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                            <button
                              className={styles.remove}
                              type="button"
                              onClick={() => removeItem(item.id, item.size)}
                              aria-label={`Quitar ${item.name} del carrito`}
                            >
                              Quitar
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <footer className={styles.footer}>
                  <div className={styles.totalRow}>
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  <button
                    className={styles.checkout}
                    type="button"
                    onClick={handleCheckout}
                    disabled={checkoutLoading || items.length === 0}
                    aria-label="Continuar al checkout"
                  >
                    {checkoutLoading ? "Procesando…" : "Continuar al checkout"}
                  </button>
                  {checkoutError && (
                    <div className={styles.error} role="alert">
                      {checkoutError}
                    </div>
                  )}
                  {items.length > 0 && (
                    <button
                      className={styles.clear}
                      type="button"
                      onClick={clear}
                      aria-label="Vaciar carrito"
                    >
                      Vaciar carrito
                    </button>
                  )}
                </footer>
              </Dialog.Content>
            </motion.aside>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

