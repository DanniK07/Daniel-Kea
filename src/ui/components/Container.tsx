import styles from "./Container.module.css";

export function Container({
  children,
  size = "default",
}: {
  children: React.ReactNode;
  size?: "default" | "wide";
}) {
  return (
    <div className={styles.outer} data-size={size}>
      {children}
    </div>
  );
}

