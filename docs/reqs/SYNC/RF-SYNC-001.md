# RF-SYNC-001: Investigar la fuente de datos (spike)

## Descripción
Identificar cómo obtener de gdg.community.dev, de forma estable y respetuosa, los capítulos de España, sus organizadores y sus eventos. El resultado cierra el ADR-0005.

## Criterios de Aceptación
- [x] Documentado en `docs/tech/sync.md` qué endpoint o página da cada dato (capítulos, país, organizadores, eventos)
- [x] Revisados `robots.txt` y términos de uso de la fuente, con la conclusión escrita
- [x] Guardados fixtures reales (JSON/HTML) de al menos 3 capítulos de España en `src/sync/__fixtures__/`
- [x] ADR-0005 pasa a Aceptada con la opción elegida

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/sync`)
- Base de datos (Firestore, `db/`)
- Sync (`src/sync`, adaptador `GdgSourcePort`)

### Dependencias
- Ninguna (primer requisito)

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Resultado en `docs/tech/sync.md`: sitemaps + `__NEXT_DATA__` de páginas públicas; la API `/api/` está
  prohibida por `robots.txt` y no se usa (ADR-0005).
- España se identifica por `chapterData.country === "ES"` (38 capítulos a 2026-11-12, semilla en
  `db/seed/chapters-es.json`).

## Implementación
- `docs/tech/sync.md` — resultado del spike
- `docs/adr/0005-metodo-de-extraccion.md` — decisión aceptada
- `src/sync/__fixtures__/` — capturas reales (organizadores anonimizados)
- `db/seed/chapters-es.json` — semilla de capítulos de España

## Estado
- [x] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [x] Documentación actualizada
