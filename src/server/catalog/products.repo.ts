import { prisma } from "@/lib/db/prisma";

export type ProductInput = {
  title: string;
  slug: string;
  description: string;
  priceCents: number;
  currency?: string;
  sizes: string[];
  images: string[];
  fabric?: string;
  weightGsm?: number;
  fit?: string;
  isActive: boolean;
  categoryId: string;
  stock?: number | null; // null = stock ilimitado, número = cantidad disponible
};

export async function listProducts(params?: {
  categorySlug?: string;
  includeInactive?: boolean;
}) {
  return await prisma.product.findMany({
    where: {
      ...(params?.categorySlug
        ? { category: { slug: params.categorySlug } }
        : {}),
      ...(params?.includeInactive ? {} : { isActive: true }),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(
  slug: string,
  options?: { includeInactive?: boolean },
) {
  return await prisma.product.findFirst({
    where: {
      slug,
      ...(options?.includeInactive ? {} : { isActive: true }),
    },
    include: { category: true },
  });
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function createProduct(input: ProductInput) {
  return await prisma.product.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      priceCents: input.priceCents,
      currency: input.currency ?? "EUR",
      sizes: input.sizes,
      images: input.images,
      fabric: input.fabric,
      weightGsm: input.weightGsm,
      fit: input.fit,
      isActive: input.isActive,
      categoryId: input.categoryId,
      stock: input.stock ?? null,
    },
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  return await prisma.product.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      priceCents: input.priceCents,
      currency: input.currency ?? "EUR",
      sizes: input.sizes,
      images: input.images,
      fabric: input.fabric,
      weightGsm: input.weightGsm,
      fit: input.fit,
      isActive: input.isActive,
      categoryId: input.categoryId,
      stock: input.stock ?? null,
    },
  });
}

export async function deleteProduct(id: string) {
  return await prisma.product.delete({ where: { id } });
}

