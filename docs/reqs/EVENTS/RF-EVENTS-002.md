# RF-EVENTS-002: Ficha de evento

## Descripción
Página de un evento con su información y enlace para inscribirse en la fuente.

## Criterios de Aceptación
- [ ] Muestra título, fecha y hora (Europe/Madrid), formato, lugar con minimapa, capítulo y sponsors
- [ ] Botón "Inscribirse" que abre la página del evento en gdg.community.dev
- [ ] Botón para añadir al calendario (.ics)
- [ ] Metadatos de evento (schema.org/Event) para SEO

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/events`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-SYNC-004

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- La inscripción nunca se gestiona en GDG.es.
- Minimapa con Google Maps (ADR-0010).

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada
