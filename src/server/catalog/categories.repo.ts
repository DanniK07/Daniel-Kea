import { prisma } from "@/lib/db/prisma";

export async function listCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function upsertCategory(input: { slug: string; name: string }) {
  return await prisma.category.upsert({
    where: { slug: input.slug },
    update: { name: input.name },
    create: { slug: input.slug, name: input.name },
  });
}

export async function deleteCategory(slug: string) {
  return await prisma.category.delete({ where: { slug } });
}

