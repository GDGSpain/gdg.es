# RF-ORGANIZERS-001: Perfil público de organizador

## Descripción
Página pública de un organizador con sus datos públicos y los capítulos que organiza.

## Criterios de Aceptación
- [ ] Muestra nombre, foto, bio (si existe) y enlaces públicos
- [ ] Lista de capítulos que organiza con su rol en cada uno
- [ ] Próximos eventos de sus capítulos
- [ ] Directorio de organizadores con búsqueda por nombre y filtro por capítulo/comunidad
- [ ] Un organizador oculto (RF-ADMIN-003) no aparece en ningún listado ni ficha

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/organizers`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-SYNC-003

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Solo datos públicos de la fuente (AGENTS.md regla 7).

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada
