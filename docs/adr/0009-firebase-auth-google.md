# ADR-0009: Firebase Authentication con Google y cookie de sesión del servidor

- **Estado**: Aceptada
- **Fecha**: 2026-10-27
- **RF relacionados**: RF-AUTH-001, RF-AUTH-002, RF-ORGANIZERS-002

## Contexto

Organizadores y administradores necesitan iniciar sesión desde la primera versión. Los organizadores de
GDG ya tienen cuenta de Google y el proyecto usa Firebase.

## Decisión

- **Firebase Authentication** con el proveedor **Google** como único método de acceso.
- El navegador inicia sesión con el SDK de Firebase Auth (`signInWithPopup`), envía el ID token a
  `POST /api/auth/session` y el servidor crea una **cookie de sesión de Firebase** (`httpOnly`, `secure`,
  `sameSite=lax`). A partir de ahí el servidor verifica la cookie con el Admin SDK en cada petición.
- Roles como **custom claims**: `admin` (emails de `ADMIN_EMAILS`) y `organizer` (al aprobar la
  vinculación con un perfil). Las comprobaciones de permiso se hacen en el caso de uso.

## Alternativas descartadas

- **Auth.js (NextAuth)**: otra pieza más cuando Firebase ya da la identidad.
- **ID token en `localStorage`**: expuesto a XSS y no sirve para Server Components.

## Consecuencias

- Es la única excepción a "el navegador no habla con Firebase" (AGENTS.md regla 7), igual que el
  redirect OAuth en BeMyFit.
- Revocar la sesión de un usuario revoca sus cookies (`revokeRefreshTokens`).
