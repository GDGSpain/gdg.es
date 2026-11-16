import Link from "next/link";
import styles from "./page.module.css";

/** RF-CHAPTERS-002: capítulo inexistente, inactivo u oculto. */
export default function ChapterNotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.notFound}>
        <h1>Capítulo no encontrado</h1>
        <p>Puede que el capítulo ya no esté activo o que la dirección no sea correcta.</p>
        <p>
          <Link href="/capitulos">Ver todos los capítulos</Link>
        </p>
      </div>
    </main>
  );
}
