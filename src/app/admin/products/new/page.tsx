import Link from "next/link";
import { assertAdmin } from "@/server/auth/assertAdmin";
import { listCategories } from "@/server/catalog/categories.repo";
import { createProduct } from "@/server/catalog/products.repo";
import { redirect } from "next/navigation";
import { Card } from "@/ui/admin/Card";
import { Button } from "@/ui/admin/Button";
import { ImagesField } from "@/features/admin/products/ImagesField";
import { productSchema } from "@/lib/validation/schemas";
import { ValidationError } from "@/lib/errors/handler";
import styles from "../page.module.css";
import formStyles from "../_shared/form.module.css";

export const dynamic = "force-dynamic";

async function createAction(formData: FormData) {
  "use server";
  await assertAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const priceCents = Math.round(Number(priceRaw) * 100);

  const sizes = String(formData.get("sizes") ?? "")
    .split(/[,\n]/g)
    .map((s) => s.trim())
    .filter(Boolean);

  const images = String(formData.get("images") ?? "")
    .split(/[,\n]/g)
    .map((s) => s.trim())
    .filter(Boolean);

  const fabric = String(formData.get("fabric") ?? "").trim() || undefined;
  const fit = String(formData.get("fit") ?? "").trim() || undefined;
  const weightGsmRaw = String(formData.get("weightGsm") ?? "").trim();
  const weightGsm = weightGsmRaw ? Number(weightGsmRaw) : undefined;
  const stockRaw = String(formData.get("stock") ?? "").trim();
  const stock = stockRaw ? Number(stockRaw) : null;
  const isActive = Boolean(formData.get("isActive"));

  const parsed = productSchema.safeParse({
    title,
    slug,
    description,
    categoryId,
    priceCents,
    sizes,
    images,
    fabric,
    fit,
    weightGsm,
    isActive,
    stock,
  });

  if (!parsed.success) {
    throw new ValidationError("Datos inválidos", parsed.error.errors);
  }

  await createProduct(parsed.data);

  redirect("/admin/products");
}

export default async function AdminNewProductPage() {
  await assertAdmin();
  const categories = await listCategories();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.kicker}>Admin</div>
        <h1 className={styles.title}>Nuevo producto</h1>
        <p className={styles.subtitle}>Ficha editorial · catálogo</p>
      </header>

      <section className={formStyles.section}>
        <h2 className={formStyles.h2}>Datos</h2>
        <Card>
          <form className={formStyles.form} action={createAction}>
            <div className={formStyles.grid2}>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Título</span>
                <input className={formStyles.input} name="title" required />
              </label>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Slug</span>
                <input className={formStyles.input} name="slug" required />
              </label>
            </div>

            <div className={formStyles.grid2}>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Categoría</span>
                <select className={formStyles.select} name="categoryId" required>
                  <option value="">Selecciona…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Precio (EUR)</span>
                <input
                  className={formStyles.input}
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </label>
            </div>

            <label className={formStyles.label}>
              <span className={formStyles.labelText}>Descripción</span>
              <textarea className={formStyles.textarea} name="description" required />
            </label>

            <div className={formStyles.grid2}>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Tallas (coma o salto)</span>
                <textarea className={formStyles.textarea} name="sizes" />
              </label>
              <ImagesField />
            </div>

            <div className={formStyles.grid2}>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Tejido</span>
                <input className={formStyles.input} name="fabric" />
              </label>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Gramaje (gsm)</span>
                <input className={formStyles.input} name="weightGsm" type="number" />
              </label>
            </div>

            <div className={formStyles.grid2}>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Corte</span>
                <input className={formStyles.input} name="fit" />
              </label>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Stock (opcional, null = ilimitado)</span>
                <input className={formStyles.input} name="stock" type="number" min="0" />
              </label>
            </div>

            <div className={formStyles.grid2}>
              <div className={formStyles.checkboxRow}>
                <input id="isActive" name="isActive" type="checkbox" defaultChecked />
                <label className={formStyles.checkboxLabel} htmlFor="isActive">
                  Publicado
                </label>
              </div>
            </div>

            <div className={formStyles.row}>
              <Button type="submit">Crear</Button>
              <Link href="/admin/products">
                <Button variant="ghost">Cancelar</Button>
              </Link>
            </div>
          </form>
        </Card>
      </section>
    </>
  );
}

