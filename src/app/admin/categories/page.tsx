import { assertAdmin } from "@/server/auth/assertAdmin";
import {
  deleteCategory,
  listCategories,
  upsertCategory,
} from "@/server/catalog/categories.repo";
import { redirect } from "next/navigation";
import { Card } from "@/ui/admin/Card";
import { Button } from "@/ui/admin/Button";
import { Table, TableRow, TableCell } from "@/ui/admin/Table";
import { DeleteButton } from "@/features/admin/shared/DeleteButton";
import { categorySchema } from "@/lib/validation/schemas";
import { ValidationError } from "@/lib/errors/handler";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function createOrUpdateAction(formData: FormData) {
  "use server";
  await assertAdmin();

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();

  const parsed = categorySchema.safeParse({ slug, name });
  if (!parsed.success) {
    throw new ValidationError("Datos inválidos", parsed.error.errors);
  }

  await upsertCategory(parsed.data);
  redirect("/admin/categories");
}

async function deleteAction(slug: string) {
  "use server";
  await assertAdmin();
  await deleteCategory(slug);
  redirect("/admin/categories");
}

export default async function AdminCategoriesPage() {
  await assertAdmin();
  const categories = await listCategories();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.kicker}>Admin</div>
        <h1 className={styles.title}>Categorías</h1>
        <p className={styles.subtitle}>Hombre / Mujer (extensible)</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.h2}>Crear / actualizar</h2>
        <Card>
          <form className={styles.form} action={createOrUpdateAction}>
            <label className={styles.label}>
              <span className={styles.labelText}>Slug</span>
              <input
                className={styles.input}
                name="slug"
                placeholder="hombre"
                required
              />
            </label>
            <label className={styles.label}>
              <span className={styles.labelText}>Nombre</span>
              <input
                className={styles.input}
                name="name"
                placeholder="Hombre"
                required
              />
            </label>
            <Button type="submit">Guardar</Button>
          </form>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Listado</h2>
        <Table>
          {categories.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className={styles.cellTitle}>{c.name}</div>
                <div className={styles.cellMeta}>{c.slug}</div>
              </TableCell>
              <DeleteButton
                action={deleteAction.bind(null, c.slug)}
                title="Eliminar categoría"
                itemName={c.name}
              />
            </TableRow>
          ))}
        </Table>
      </section>
    </>
  );
}
