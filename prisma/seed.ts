import { prisma } from "../src/lib/db/prisma";
import { hashPassword } from "../src/server/auth/password";

async function main() {
  const adminEmail = "admin@danielkea.local";
  const adminPassword = "danielkea-admin";

  const [hombre, mujer] = await Promise.all([
    prisma.category.upsert({
      where: { slug: "hombre" },
      update: { name: "Hombre" },
      create: { slug: "hombre", name: "Hombre" },
    }),
    prisma.category.upsert({
      where: { slug: "mujer" },
      update: { name: "Mujer" },
      create: { slug: "mujer", name: "Mujer" },
    }),
  ]);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      name: "Admin",
      role: "ADMIN",
      hashedPassword: await hashPassword(adminPassword),
    },
  });

  const existing = await prisma.product.count();
  if (existing === 0) {
    await prisma.product.createMany({
      data: [
        {
          categoryId: hombre.id,
          slug: "abrigo-silueta-noir",
          title: "Abrigo Silueta Noir",
          description:
            "Abrigo largo de líneas limpias. Construcción minimalista con caída estructurada.",
          priceCents: 42000,
          sizes: ["S", "M", "L"],
          images: [],
          fabric: "Lana fría",
          weightGsm: 420,
          fit: "Regular",
          isActive: true,
        },
        {
          categoryId: mujer.id,
          slug: "camisa-marfil-editorial",
          title: "Camisa Marfil Editorial",
          description:
            "Camisa de algodón con proporción editorial. Cuello preciso, puño limpio.",
          priceCents: 16000,
          sizes: ["XS", "S", "M", "L"],
          images: [],
          fabric: "Algodón",
          weightGsm: 160,
          fit: "Relaxed",
          isActive: true,
        },
        {
          categoryId: mujer.id,
          slug: "falda-corte-mist",
          title: "Falda Corte Mist",
          description:
            "Falda midi con costuras invisibles y movimiento suave. Beige sobrio.",
          priceCents: 21000,
          sizes: ["XS", "S", "M", "L"],
          images: [],
          fabric: "Viscosa",
          weightGsm: 220,
          fit: "Slim",
          isActive: true,
        },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

