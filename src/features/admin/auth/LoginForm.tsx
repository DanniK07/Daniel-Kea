"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./LoginForm.module.css";
import { motion } from "framer-motion";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setPending(false);

    if (!res || res.error) {
      setError("Credenciales inválidas.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <motion.form
      className={styles.form}
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <label className={styles.label}>
        <span className={styles.labelText}>Email</span>
        <input
          className={styles.input}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@danielkea.local"
          required
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>Password</span>
        <input
          className={styles.input}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </label>

      {error && <div className={styles.error}>{error}</div>}

      <motion.button
        className={styles.submit}
        type="submit"
        disabled={pending}
        whileHover={{ y: -1, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.16, ease: [0.18, 0.89, 0.32, 1] }}
      >
        {pending ? "Entrando…" : "Entrar"}
      </motion.button>
    </motion.form>
  );
}

