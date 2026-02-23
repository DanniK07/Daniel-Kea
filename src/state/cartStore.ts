import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: string;
  name: string;
  price: number;
  size?: string;
  quantity: number;
};

type CartState = {
  open: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, size?: string) => void;
  setQuantity: (id: string, size: string | undefined, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      open: false,
      items: [],
      openCart: () => set({ open: true }),
      closeCart: () => set({ open: false }),
      toggleCart: () => set((s) => ({ open: !s.open })),
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id && i.size === item.size,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing
                  ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                  : i,
              ),
              open: true,
            };
          }
          return {
            items: [...state.items, { ...item, quantity: item.quantity ?? 1 }],
            open: true,
          };
        }),
      removeItem: (id, size) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.size === size)),
        })),
      setQuantity: (id, size, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id && i.size === size ? { ...i, quantity } : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "daniel-kea-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

