# ADR-0005: Método de extracción de gdg.community.dev

- **Estado**: Propuesta (se decide con el resultado de RF-SYNC-001)
- **Fecha**: 2026-10-27

## Contexto

`https://gdg.community.dev/chapters/` carga el listado de forma dinámica (no viene en el HTML inicial),
lo que sugiere que la plataforma consume una API JSON interna. No hay API pública documentada.

## Opciones a evaluar

1. **API JSON interna** de la plataforma (la que usa el propio listado): la más estable si existe.
2. **HTML de las páginas de capítulo** con un parser (cheerio).
3. **Navegador sin cabeza** (Playwright): solo si lo anterior no sirve; más lento y frágil.

## Criterios

Términos de uso y `robots.txt`, estabilidad, que dé el país del capítulo, que exponga organizadores y
eventos, coste de mantenimiento.

## Consecuencias

Cualquiera que sea la opción, va detrás de un puerto (`GdgSourcePort`) para poder cambiarla sin tocar
los casos de uso, y con fixtures guardados para los tests.
