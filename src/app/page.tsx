import Image from "next/image";
import styles from "./page.module.css";

/** Portada provisional mientras se implementan los RF de la Fase 1 (ver PLAN.md). */
export default function Home() {
  return (
    <main className={styles.main}>
      <Image src="/gdgspain-logo.png" alt="GDG Spain" width={388} height={80} priority />
      <h1>Google Developer Groups de España</h1>
      <p>
        Estamos reconstruyendo gdg.es: un directorio con todos los capítulos, sus organizadores, los sponsors
        que los apoyan y un mapa de eventos.
      </p>
      <p>
        Mientras tanto, encuentra tu capítulo en{" "}
        <a href="https://gdg.community.dev/chapters/">gdg.community.dev</a>.
      </p>
    </main>
  );
}
