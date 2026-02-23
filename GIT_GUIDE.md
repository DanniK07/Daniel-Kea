# Guía: Guardar cambios y subir a GitHub

## 📦 PASO 1: Guardar cambios en Git

### 1.1. Añadir todos los archivos al staging
```bash
cd "D:\tienda de ropa\daniel-kea"
git add .
```

### 1.2. Verificar qué se va a commitear
```bash
git status
```

### 1.3. Hacer commit con un mensaje descriptivo
```bash
git commit -m "feat: aplicación completa Daniel Kéa - arquitectura premium, checkout, seguridad y refinamiento visual"
```

---

## 🚀 PASO 2: Subir a GitHub

### 2.1. Crear repositorio en GitHub (si no existe)
1. Ve a https://github.com/new
2. Nombre del repositorio: `daniel-kea` (o el que prefieras)
3. **NO** inicialices con README, .gitignore o licencia (ya los tienes)
4. Haz clic en "Create repository"

### 2.2. Conectar tu repositorio local con GitHub
```bash
# Reemplaza TU_USUARIO con tu usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/daniel-kea.git
```

### 2.3. Verificar que se añadió correctamente
```bash
git remote -v
```

### 2.4. Subir cambios (primera vez)
```bash
git branch -M main
git push -u origin main
```

### 2.5. Para futuros cambios
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

---

## ▶️ PASO 3: Ejecutar el proyecto

### 3.1. Instalar dependencias (si es la primera vez)
```bash
cd "D:\tienda de ropa\daniel-kea"
npm install
```

### 3.2. Configurar variables de entorno
Crea el archivo `.env.local` en la raíz del proyecto:
```env
# Base de datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/danielkea?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-super-seguro-aqui-genera-uno-con-openssl-rand-base64-32"

# Opcional: URL del sitio (para checkout)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**Para generar NEXTAUTH_SECRET:**
```bash
# En PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# O usa: https://generate-secret.vercel.app/32
```

### 3.3. Levantar PostgreSQL con Docker
```bash
docker compose up -d
```

### 3.4. Configurar base de datos
```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar base de datos con datos iniciales
npm run db:seed
```

### 3.5. Iniciar servidor de desarrollo
```bash
npm run dev
```

El proyecto estará disponible en: **http://localhost:3000**

---

## 📝 Credenciales de Admin (después del seed)

- **Email:** `admin@danielkea.local`
- **Password:** `danielkea-admin`
- **URL:** http://localhost:3000/admin/login

---

## 🔧 Comandos útiles

```bash
# Ver estado de Git
git status

# Ver historial de commits
git log --oneline

# Ver diferencias antes de commitear
git diff

# Parar Docker PostgreSQL
docker compose down

# Ver logs de Docker
docker compose logs

# Abrir Prisma Studio (editor visual de BD)
npm run prisma:studio
```

---

## ⚠️ Notas importantes

1. **Nunca subas `.env.local`** - Ya está en `.gitignore`
2. **Revisa `git status`** antes de hacer commit
3. **Usa mensajes de commit descriptivos**
4. **Si hay errores**, revisa los logs en la terminal
