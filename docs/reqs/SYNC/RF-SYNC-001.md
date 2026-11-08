# RF-SYNC-001: Investigar la fuente de datos (spike)

## Descripción
Identificar cómo obtener de gdg.community.dev, de forma estable y respetuosa, los capítulos de España, sus organizadores y sus eventos. El resultado cierra el ADR-0005.

## Criterios de Aceptación
- [ ] Documentado en `docs/tech/sync.md` qué endpoint o página da cada dato (capítulos, país, organizadores, eventos)
- [ ] Revisados `robots.txt` y términos de uso de la fuente, con la conclusión escrita
- [ ] Guardados fixtures reales (JSON/HTML) de al menos 3 capítulos de España en `src/sync/__fixtures__/`
- [ ] ADR-0005 pasa a Aceptada con la opción elegida

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
- El listado de `/chapters/` se carga dinámicamente: buscar la llamada de red que lo alimenta.
- **Pendiente de decidir**: ¿cómo se identifica España: campo país, región, o coordenadas?

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada
