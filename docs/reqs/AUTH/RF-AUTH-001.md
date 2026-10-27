# RF-AUTH-001: Inicio de sesión con Google

## Descripción
Organizadores y administradores inician sesión con su cuenta de Google mediante Firebase Authentication.
Entra en la primera versión.

## Criterios de Aceptación
- [ ] Botón "Entrar con Google"; sin registro con contraseña
- [ ] El navegador obtiene el ID token con el SDK de Firebase Auth y el servidor lo canjea por una cookie de sesión de Firebase (`httpOnly`, `secure`)
- [ ] Cierre de sesión que borra la cookie y revoca la sesión
- [ ] Las páginas públicas funcionan sin sesión
- [ ] Las rutas `/admin` y `/api` de escritura exigen sesión

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/auth`)
- Base de datos (Firestore, `db/`)

### Dependencias
- Ninguna

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Firebase Authentication con proveedor Google (ADR-0009).
- Único punto en que el navegador habla con Firebase (AGENTS.md regla 7).

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada
