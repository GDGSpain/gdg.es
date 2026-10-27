# RF-AUTH-002: Roles: administrador y organizador

## Descripción
Cada usuario tiene un rol que limita lo que puede hacer.

## Criterios de Aceptación
- [ ] Roles guardados como custom claims de Firebase (ADR-0009)
- [ ] Rol `admin`: los emails de `ADMIN_EMAILS`; acceso total al panel
- [ ] Rol `organizer`: usuario vinculado a un perfil de organizador (RF-ORGANIZERS-002); edita solo lo suyo
- [ ] Usuario sin rol: solo puede solicitar vinculación
- [ ] Toda comprobación de permisos se hace en el caso de uso, no solo en la UI

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/auth`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-AUTH-001

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Ninguna

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada
