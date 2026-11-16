import Image from "next/image";
import Link from "next/link";
import styles from "./site-header.module.css";

/** Cabecera común con la marca y la navegación principal. */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="GDG España, inicio">
          <Image src="/gdgspain-logo.png" alt="" width={194} height={40} priority />
        </Link>
        <nav aria-label="Principal">
          <ul className={styles.nav}>
            <li>
              <Link href="/capitulos">Capítulos</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
