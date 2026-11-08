# RF-ADMIN-002: Gestión de sponsors

## Descripción
CRUD de sponsors desde el panel.

## Criterios de Aceptación
- [ ] Crear, editar y borrar sponsors (nombre, logo, web, descripción)
- [ ] Subida de logo con validación de tipo y tamaño
- [ ] Borrar un sponsor elimina sus asociaciones tras confirmación

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/admin`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-AUTH-002

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Logos en Cloud Storage for Firebase, subidos desde el servidor; reglas de Storage sin escritura de cliente.
- **Pendiente de decidir**: ¿lectura pública directa del bucket o servida a través de la app?

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada
