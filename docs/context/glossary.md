# Glosario de dominio

Vocabulario de GDG.es. Escrito a mano: si un RF introduce o cambia un concepto, se actualiza aquí en el
mismo cambio.

## Términos que se confunden

| No confundir | con | Diferencia |
|---|---|---|
| **Capítulo** | **Ciudad** | Un capítulo es un GDG concreto (p. ej. GDG Madrid). Una ciudad puede tener varios capítulos y un capítulo puede cubrir una provincia. |
| **Organizador** | **Miembro** | Organizador: persona con rol de organización en un capítulo según la fuente. Los miembros (asistentes) no se importan. |
| **Sponsor compartido** | **Sponsor de evento** | El compartido apoya a varios capítulos; el de evento solo a un evento. Es la misma entidad `sponsor` con relaciones distintas. |
| **Dato de origen** | **Dato propio** | De origen: importado de gdg.community.dev; se sobrescribe en cada sync. Propio: añadido en GDG.es (bio ampliada, sponsors); el sync nunca lo pisa. |

## Términos

- **Fuente**: gdg.community.dev, plataforma oficial de Google para los GDG.
- **Sync / sincronización**: ejecución del job que importa datos de la fuente (RF-SYNC-*).
- **Id de origen** (`sourceId`): identificador del elemento en la fuente; clave del upsert.
- **Capítulo inactivo**: estaba en la fuente y ya no aparece; se oculta, no se borra (RF-SYNC-005).
- **Formato de evento**: presencial, online o híbrido.
