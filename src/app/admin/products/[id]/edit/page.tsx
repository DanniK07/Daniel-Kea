import Link from "next/link";
import { assertAdmin } from "@/server/auth/assertAdmin";
import { listCategories } from "@/server/catalog/categories.repo";
import { getProductById, updateProduct } from "@/server/catalog/products.repo";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/ui/admin/Card";
import { Button } from "@/ui/admin/Button";
import { ImagesField } from "@/features/admin/products/ImagesField";
import { productSchema } from "@/lib/validation/schemas";
import { ValidationError } from "@/lib/errors/handler";
import styles from "../../page.module.css";
import formStyles from "../../_shared/form.module.css";

export const dynamic = "force-dynamic";

async function updateAction(id: string, formData: FormData) {
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

  await updateProduct(id, parsed.data);

  redirect("/admin/products");
}

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await assertAdmin();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductById(id),
    listCategories(),
  ]);
  if (!product) notFound();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.kicker}>Admin</div>
        <h1 className={styles.title}>Editar producto</h1>
        <p className={styles.subtitle}>{product.title}</p>
      </header>

      <section className={formStyles.section}>
        <h2 className={formStyles.h2}>Datos</h2>
        <Card>
          <form
            className={formStyles.form}
            action={updateAction.bind(null, product.id)}
          >
            <div className={formStyles.grid2}>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Título</span>
                <input
                  className={formStyles.input}
                  name="title"
                  defaultValue={product.title}
                  required
                />
              </label>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Slug</span>
                <input
                  className={formStyles.input}
                  name="slug"
                  defaultValue={product.slug}
                  required
                />
              </label>
            </div>

            <div className={formStyles.grid2}>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Categoría</span>
                <select
                  className={formStyles.select}
                  name="categoryId"
                  defaultValue={product.categoryId}
                  required
                >
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
                  defaultValue={(product.priceCents / 100).toFixed(2)}
                  required
                />
              </label>
            </div>

            <label className={formStyles.label}>
              <span className={formStyles.labelText}>Descripción</span>
              <textarea
                className={formStyles.textarea}
                name="description"
                defaultValue={product.description}
                required
              />
            </label>

            <div className={formStyles.grid2}>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Tallas</span>
                <textarea
                  className={formStyles.textarea}
                  name="sizes"
                  defaultValue={product.sizes.join(", ")}
                />
              </label>
              <ImagesField initialValue={product.images.join("\n")} />
            </div>

            <div className={formStyles.grid2}>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Tejido</span>
                <input
                  className={formStyles.input}
                  name="fabric"
                  defaultValue={product.fabric ?? ""}
                />
              </label>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Gramaje (gsm)</span>
                <input
                  className={formStyles.input}
                  name="weightGsm"
                  type="number"
                  defaultValue={product.weightGsm ?? ""}
                />
              </label>
            </div>

            <div className={formStyles.grid2}>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Corte</span>
                <input
                  className={formStyles.input}
                  name="fit"
                  defaultValue={product.fit ?? ""}
                />
              </label>
              <label className={formStyles.label}>
                <span className={formStyles.labelText}>Stock (opcional, null = ilimitado)</span>
                <input
                  className={formStyles.input}
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={product.stock ?? ""}
                />
              </label>
            </div>

            <div className={formStyles.grid2}>
              <div className={formStyles.checkboxRow}>
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  defaultChecked={product.isActive}
                />
                <label className={formStyles.checkboxLabel} htmlFor="isActive">
                  Publicado
                </label>
              </div>
            </div>

            <div className={formStyles.row}>
              <Button type="submit">Guardar</Button>
              <Link href="/admin/products">
                <Button variant="ghost">Volver</Button>
              </Link>
            </div>
          </form>
        </Card>
      </section>
    </>
  );
}

