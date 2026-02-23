## Variables de entorno (local)

Por seguridad, este repo ignora archivos `.env*`. En local, crea **`D:\tienda de ropa\daniel-kea\.env.local`** con:

```bash
DATABASE_URL="postgresql://danielkea:danielkea@localhost:5432/danielkea?schema=public"
NEXTAUTH_SECRET="pon-un-secret-largo-y-aleatorio"
NEXTAUTH_URL="http://localhost:3000"
```

## Credenciales admin (seed)

Tras ejecutar el seed, podrás entrar en:

- Ruta: `/admin/login`
- Email: `admin@danielkea.local`
- Password: `danielkea-admin`

Luego cámbialo en producción.

