# Decisiones de arquitectura (ADR)

Cada fichero recoge **una** decisión: contexto, qué se decidió, qué se descartó y consecuencias.
Formato: [Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).
Una decisión aceptada no se edita: si cambia, se escribe un ADR nuevo que la **reemplaza** y el antiguo
pasa a `Reemplazada por ADR-NNNN`.

| ADR | Decisión | Estado |
|---|---|---|
| [0001](0001-registrar-decisiones.md) | Registrar las decisiones de arquitectura como ADR | Aceptada |
| [0002](0002-nextjs-full-stack.md) | Next.js (App Router, TypeScript) como aplicación full-stack única | Aceptada |
| [0003](0003-postgresql.md) | PostgreSQL como base de datos; ORM por decidir | Reemplazada por ADR-0008 |
| [0004](0004-ingesta-a-bd-propia.md) | Los datos se importan a una BD propia; la web nunca consulta la fuente al servir | Aceptada |
| [0005](0005-metodo-de-extraccion.md) | Extraer de gdg.community.dev con páginas públicas y sitemaps, nunca con su API | Aceptada |
| [0006](0006-arquitectura-por-capas.md) | Casos de uso con puertos y `Result<T,E>` dentro de Next.js | Aceptada |
| [0007](0007-contexto-generado-desde-codigo.md) | `docs/context/` se genera desde el código y se comprueba en CI | Aceptada |
| [0008](0008-firestore.md) | Cloud Firestore como base de datos, accedida solo desde el servidor | Aceptada |
| [0009](0009-firebase-auth-google.md) | Firebase Authentication con Google y cookie de sesión del servidor | Aceptada |
| [0010](0010-google-maps-platform.md) | Google Maps Platform para mapas y geocodificación | Aceptada |
| [0011](0011-hosting-firebase-app-hosting.md) | Firebase App Hosting para la web y Cloud Scheduler para el sync | Propuesta |

Nuevo ADR: copiar [`TEMPLATE.md`](TEMPLATE.md) con el siguiente número y añadir su fila aquí.
