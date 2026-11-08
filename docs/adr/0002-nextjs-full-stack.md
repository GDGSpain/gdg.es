# ADR-0002: Next.js (App Router, TypeScript) como aplicación full-stack única

- **Estado**: Aceptada
- **Fecha**: 2026-10-27

## Contexto

Es un directorio público: el SEO y el tiempo de carga importan (cada capítulo, organizador y evento debe
ser indexable). Hay un único autor, así que cada pieza desplegable más es coste de mantenimiento.

## Decisión

Una sola aplicación Next.js (App Router, TypeScript estricto) sirve las páginas públicas (renderizado en
servidor con revalidación), el panel `/admin` y los route handlers `/api`. El job de sincronización vive
en el mismo repositorio y comparte módulos.

## Alternativas descartadas

- **Front + API Express separados** (patrón BeMyFit): dos despliegues para un producto sin app móvil.
- **Sitio estático puro**: el panel, el login y la edición de perfiles necesitan servidor.

## Consecuencias

- Un despliegue, tipos compartidos de punta a punta, buen SEO.
- Riesgo de mezclar lógica en componentes: se mitiga con ADR-0006 (casos de uso fuera de `app/`).
