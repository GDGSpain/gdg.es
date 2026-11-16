"use client";

import { useEffect } from "react";

/** RF-CHAPTERS-001/002: error al leer los capítulos (p. ej. base de datos no disponible). */
export default function ChaptersError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "var(--space-16) var(--container-gutter)" }}>
      <h1>No hemos podido cargar los capítulos</h1>
      <p style={{ margin: "var(--space-4) 0" }}>
        Puede ser un problema temporal. Inténtalo de nuevo en unos segundos.
      </p>
      <button type="button" onClick={() => retry()}>
        Reintentar
      </button>
    </main>
  );
}
