import { z } from "zod";

// Sanitización básica: remover caracteres peligrosos
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remover < y >
    .replace(/javascript:/gi, "") // Remover javascript:
    .replace(/on\w+=/gi, ""); // Remover event handlers
}

// Schemas de validación para productos
export const productSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(200, "El título es demasiado largo")
    .transform(sanitizeString),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(100, "El slug es demasiado largo")
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones")
    .transform(sanitizeString),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(5000, "La descripción es demasiado larga")
    .transform(sanitizeString),
  categoryId: z.string().min(1, "La categoría es requerida"),
  priceCents: z
    .number()
    .int("El precio debe ser un número entero")
    .positive("El precio debe ser mayor que cero")
    .max(99999999, "El precio es demasiado alto"),
  currency: z.string().length(3).default("EUR").optional(),
  sizes: z.array(z.string()).default([]),
  images: z.array(z.string().url("URL de imagen inválida")).default([]),
  fabric: z.string().max(100).transform(sanitizeString).optional().nullable(),
  weightGsm: z
    .number()
    .int()
    .positive()
    .max(10000)
    .optional()
    .nullable(),
  fit: z.string().max(100).transform(sanitizeString).optional().nullable(),
  isActive: z.boolean().default(true),
  stock: z
    .number()
    .int()
    .nonnegative("El stock no puede ser negativo")
    .optional()
    .nullable(),
});

// Schema para categorías
export const categorySchema = z.object({
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(50, "El slug es demasiado largo")
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones")
    .transform((s) => sanitizeString(s).toLowerCase()),
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre es demasiado largo")
    .transform(sanitizeString),
});

// Schema para checkout
export const checkoutItemSchema = z.object({
  productId: z.string().min(1, "ID de producto inválido"),
  quantity: z.number().int().positive("La cantidad debe ser mayor que cero"),
  size: z.string().optional(),
});

export const checkoutSchema = z.object({
  currency: z.string().length(3).default("EUR").optional(),
  items: z.array(checkoutItemSchema).min(1, "El carrito está vacío"),
});

// Schema para login
export const loginSchema = z.object({
  email: z.string().email("Email inválido").transform((s) => s.toLowerCase().trim()),
  password: z.string().min(1, "La contraseña es requerida"),
});
