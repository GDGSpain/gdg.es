# RF-ORGANIZERS-002: El organizador reclama y edita su perfil

## Descripción
Un organizador puede iniciar sesión, vincularse a su perfil importado y añadir datos propios. Entra en la
primera versión (login desde el inicio).

## Criterios de Aceptación
- [ ] Tras iniciar sesión (RF-AUTH-001), puede solicitar vincular su cuenta a un perfil de organizador
- [ ] La vinculación la aprueba un admin (o se valida automáticamente si coincide un identificador verificable)
- [ ] Puede editar campos propios: bio ampliada, enlaces, temas de interés; no los campos de origen
- [ ] Puede pedir ocultar su perfil (dispara RF-ADMIN-003)

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/organizers`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-ORGANIZERS-001
- RF-AUTH-001
- RF-AUTH-002

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- **Pendiente de decidir**: método de verificación de identidad para vincular.

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada
