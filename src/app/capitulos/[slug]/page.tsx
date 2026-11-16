/**
 * RF-CHAPTERS-002: ficha de capítulo. RF-SYNC-003: organizadores (sección añadida al importarlos).
 * El HTML de la descripción viene de gdg.community.dev y se sanea antes de insertarlo.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buildChapterReader } from "@/composition";
import { getChapter } from "@/modules/chapters/get-chapter.service";
import { getConfig } from "@/shared/config/config";
import { comunidadPorId } from "@/shared/geo/comunidades";
import { sanitizeSourceHtml } from "@/shared/html/sanitize";
import { ChapterLogo } from "../../_components/chapter-logo";
import styles from "./page.module.css";

type Props = PageProps<"/capitulos/[slug]">;

async function load(slug: string) {
  return getChapter({ reader: buildChapterReader(getConfig()) }, slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await load(slug);
  if (!result.ok) return { title: "Capítulo no encontrado" };
  const c = result.value;
  return {
    title: c.title,
    description: `${c.title}: comunidad de desarrolladores en ${c.city}. Organizadores, enlaces y próximos eventos.`,
  };
}

export default function ChapterPage({ params }: Props) {
  return (
    <main className={styles.main}>
      <p className={styles.back}>
        <Link href="/capitulos">← Todos los capítulos</Link>
      </p>
      <Suspense fallback={<p>Cargando capítulo…</p>}>
        <ChapterView params={params} />
      </Suspense>
    </main>
  );
}

const dateFormat = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Madrid",
});

async function ChapterView({ params }: { params: Props["params"] }) {
  const { slug } = await params;
  const result = await load(slug);
  if (!result.ok) notFound();
  const c = result.value;
  const comunidad = c.comunidadId ? comunidadPorId(c.comunidadId) : null;
  const description = sanitizeSourceHtml(c.descriptionHtml);
  const links = [
    c.website && { href: c.website, label: "Web" },
    c.twitter && { href: `https://x.com/${encodeURIComponent(c.twitter)}`, label: `X @${c.twitter}` },
    c.linkedin && { href: c.linkedin, label: "LinkedIn" },
    c.instagram && {
      href: `https://www.instagram.com/${encodeURIComponent(c.instagram)}/`,
      label: `Instagram @${c.instagram}`,
    },
  ].filter((l): l is { href: string; label: string } => Boolean(l));

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <ChapterLogo title={c.title} logoUrl={c.logoUrl} size={96} />
        <div className={styles.heading}>
          <h1>{c.title}</h1>
          <p className={styles.meta}>
            {[c.city, comunidad?.nombre].filter(Boolean).join(" · ")}
            {c.isCampus && <span className={styles.badge}>GDG on Campus</span>}
          </p>
          {c.membersCount !== null && (
            <p className={styles.members}>
              {c.membersCount.toLocaleString("es-ES")} miembros en gdg.community.dev
            </p>
          )}
        </div>
        <a className={styles.cta} href={c.sourceUrl} target="_blank" rel="noopener noreferrer">
          Unirse en gdg.community.dev
        </a>
      </header>

      <div className={styles.body}>
        <section aria-labelledby="sobre">
          <h2 id="sobre">Sobre el capítulo</h2>
          {description ? (
            <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <p>Este capítulo todavía no tiene descripción.</p>
          )}
        </section>

        <aside className={styles.aside}>
          {links.length > 0 && (
            <section aria-labelledby="enlaces">
              <h2 id="enlaces">Enlaces</h2>
              <ul className={styles.links}>
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer nofollow">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <p className={styles.synced}>
            Datos de <a href={c.sourceUrl}>gdg.community.dev</a>, actualizados el{" "}
            {dateFormat.format(c.syncedAt)}.
          </p>
        </aside>
      </div>
    </article>
  );
}
