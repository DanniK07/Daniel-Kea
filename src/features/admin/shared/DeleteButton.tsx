"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/ui/admin/ConfirmDialog";
import { Button } from "@/ui/admin/Button";

type Props = {
  action: () => Promise<void>;
  title: string;
  description?: string;
  itemName?: string;
};

export function DeleteButton({ action, title, description, itemName }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleConfirm = () => {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  };

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={pending}
      >
        Eliminar
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
        title={title}
        description={
          description ||
          `¿Estás seguro de eliminar "${itemName}"? Esta acción no se puede deshacer.`
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </>
  );
}
