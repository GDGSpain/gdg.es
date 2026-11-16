import styles from "./site-footer.module.css";

/** Pie común: origen de los datos y aviso de independencia. */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>
          Datos públicos de <a href="https://gdg.community.dev/">gdg.community.dev</a>, actualizados a diario.
        </p>
        <p>
          GDG Spain es una comunidad independiente; sus actividades y opiniones no representan a Google.
          Código en <a href="https://github.com/GDGSpain/gdg.es">GitHub</a>.
        </p>
      </div>
    </footer>
  );
}
