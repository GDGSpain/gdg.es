# RGPD

GDG.es publica datos personales de organizadores (nombre, foto, rol, capítulo, enlaces públicos) que ya
son públicos en gdg.community.dev. Aun siendo públicos, republicarlos es un tratamiento.

Pendiente de redactar en esta carpeta:

- [ ] **Base jurídica**: interés legítimo (difusión de la comunidad), con evaluación de ponderación.
- [ ] **Minimización**: solo los campos de arriba; nunca email ni teléfono (AGENTS.md, regla 7).
- [ ] **Derecho de oposición y supresión**: un organizador puede pedir ocultar su perfil (RF-ADMIN-003)
      y el sync debe respetarlo (no reimportar).
- [ ] **Información**: página de privacidad que explique origen de los datos y cómo ejercer derechos.
- [ ] **Registro de actividades de tratamiento**.
- [ ] **Encargados del tratamiento**: Google (Firebase, GCP y Google Maps Platform); aceptar los términos
      de tratamiento de datos de Google Cloud y elegir región europea para Firestore y Storage.
- [ ] **Cuentas de usuario** (Firebase Auth): solo email, nombre y foto de Google; finalidad, conservación
      y borrado al darse de baja.
