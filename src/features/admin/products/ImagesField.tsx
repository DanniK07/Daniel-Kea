"use client";

import { useState } from "react";
import formStyles from "@/app/admin/products/_shared/form.module.css";
import styles from "./ImagesField.module.css";

type Props = {
  initialValue?: string;
};

export function ImagesField({ initialValue = "" }: Props) {
  const [value, setValue] = useState(initialValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Error al subir la imagen");
      }

      const json = (await res.json()) as { url: string };
      const next = value ? `${value}\n${json.url}` : json.url;
      setValue(next);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error(err);
      }
      setError("No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className={formStyles.label}>
      <span className={formStyles.labelText}>Imágenes</span>
      <textarea
        className={formStyles.textarea}
        name="images"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Una URL por línea"
      />

      <div className={styles.row}>
        <label className={styles.upload}>
          <span>{uploading ? "Subiendo…" : "Subir imagen"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  );
}

