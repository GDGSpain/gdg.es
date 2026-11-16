/**
 * RF-CHAPTERS-001: directorio de capítulos GDG de España.
 * Los filtros viven en la URL (`?q=` y `?comunidad=`) con un formulario GET: funciona sin JavaScript y
 * los resultados se pueden compartir.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { buildChapterReader } from "@/composition";
import { listChapters } from "@/modules/chapters/list-chapters.service";
import { getConfig } from "@/shared/config/config";
import { ChapterLogo } from "../_components/chapter-logo";
import { comunidadPorId } from "@/shared/geo/comunidades";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Capítulos",
  description: "Todos los Google Developer Groups de España: busca el tuyo por ciudad o comunidad autónoma.",
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.slice(0, 80);

export default function ChaptersPage(props: PageProps<"/capitulos">) {
  return (
    <main className={styles.main}>
      <header className={styles.intro}>
        <h1>Capítulos GDG en España</h1>
        <p>
          Comunidades locales y universitarias de desarrolladores que organizan charlas, talleres y DevFests.
        </p>
      </header>
      <Suspense fallback={<p className={styles.status}>Cargando capítulos…</p>}>
        <Directory searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function Directory({ searchParams }: { searchParams: PageProps<"/capitulos">["searchParams"] }) {
  const params = await searchParams;
  const query = first(params.q) ?? "";
  const comunidadId = first(params.comunidad) ?? "";
  const result = await listChapters(
    { reader: buildChapterReader(getConfig()) },
    { query, comunidadId: comunidadId || undefined },
  );
  if (!result.ok) return null;
  const { chapters, total, comunidades } = result.value;
  const filtered = Boolean(query || comunidadId);

  return (
    <>
      <form className={styles.filters} role="search" action="/capitulos">
        <label className={styles.field}>
          <span>Buscar</span>
          <input type="search" name="q" defaultValue={query} placeholder="Nombre o ciudad" maxLength={80} />
        </label>
        <label className={styles.field}>
          <span>Comunidad autónoma</span>
          <select name="comunidad" defaultValue={comunidadId}>
            <option value="">Todas</option>
            {comunidades.map(({ comunidad, count }) => (
              <option key={comunidad.id} value={comunidad.id}>
                {comunidad.nombre} ({count})
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={styles.submit}>
          Filtrar
        </button>
        {filtered && (
          <Link href="/capitulos" className={styles.reset}>
            Quitar filtros
          </Link>
        )}
      </form>

      <p className={styles.status} aria-live="polite">
        {filtered ? `${chapters.length} de ${total} capítulos` : `${total} capítulos`}
      </p>

      {chapters.length === 0 ? (
        <p className={styles.empty}>
          No hay capítulos con esos filtros. <Link href="/capitulos">Ver todos</Link>
        </p>
      ) : (
        <ul className={styles.grid}>
          {chapters.map((c) => (
            <li key={c.slug}>
              <Link href={`/capitulos/${c.slug}`} className={styles.card}>
                <ChapterLogo title={c.title} logoUrl={c.logoUrl} />
                <span className={styles.cardText}>
                  <span className={styles.cardTitle}>{c.title}</span>
                  <span className={styles.cardMeta}>
                    {[c.city, c.comunidadId ? comunidadPorId(c.comunidadId)?.nombre : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                  {c.isCampus && <span className={styles.badge}>GDG on Campus</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
