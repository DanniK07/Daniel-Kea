## Daniel Kéa — Web (local)

Arquitectura modular (Next.js 15 + TypeScript) con:

- UI editorial minimalista (Design System propio con CSS Modules + variables globales)
- Animaciones sutiles (Framer Motion)
- Scroll premium (Lenis)
- Carrito lateral (Zustand + Radix Dialog)
- Auth admin (NextAuth Credentials + rol `ADMIN`)
- Prisma + PostgreSQL local (docker)

## Requisitos

- Node.js LTS
- Docker Desktop (para PostgreSQL local)

## Variables de entorno

Lee `docs/env.md`.

## Base de datos (local)

1) Levanta PostgreSQL:

```bash
docker compose up -d
```

2) Migra + seed:

```bash
npm run prisma:migrate
npm run db:seed
```

## Desarrollo

```bash
npm run dev
```

## Admin

- Login: `/admin/login`
