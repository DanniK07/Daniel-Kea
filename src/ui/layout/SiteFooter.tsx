import styles from "./SiteFooter.module.css";
import { Container } from "@/ui/components/Container";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.brand}>
            <span className={styles.wordmark}>Daniel Kéa</span>
            <span className={styles.caption}>
              Editorial minimalism · Tailoring · Ready-to-wear
            </span>
          </div>
          <div className={styles.meta}>
            <span>© {new Date().getFullYear()} Daniel Kéa</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

