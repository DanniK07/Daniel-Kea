import Link from "next/link";
import { assertAdmin } from "@/server/auth/assertAdmin";
import { deleteProduct, listProducts } from "@/server/catalog/products.repo";
import { redirect } from "next/navigation";
import { Table, TableRow, TableCell } from "@/ui/admin/Table";
import { Button } from "@/ui/admin/Button";
import { DeleteButton } from "@/features/admin/shared/DeleteButton";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function deleteAction(id: string) {
  "use server";
  await assertAdmin();
  await deleteProduct(id);
  redirect("/admin/products");
}

export default async function AdminProductsPage() {
  await assertAdmin();
  const products = await listProducts({ includeInactive: true });

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div>
            <div className={styles.kicker}>Admin</div>
            <h1 className={styles.title}>Productos</h1>
            <p className={styles.subtitle}>Catálogo editorial · CRUD</p>
          </div>
          <Link href="/admin/products/new">
            <Button>Nuevo producto</Button>
          </Link>
        </div>
      </header>

      <Table>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <div className={styles.name}>{p.title}</div>
              <div className={styles.meta}>
                {p.category.name} · {p.slug} · €{(p.priceCents / 100).toFixed(2)}
              </div>
            </TableCell>
            <div className={styles.actions}>
              <Link href={`/admin/products/${p.id}/edit`}>
                <Button variant="ghost" size="sm">
                  Editar
                </Button>
              </Link>
              <DeleteButton
                action={deleteAction.bind(null, p.id)}
                title="Eliminar producto"
                itemName={p.title}
              />
            </div>
          </TableRow>
        ))}
      </Table>
    </>
  );
}
