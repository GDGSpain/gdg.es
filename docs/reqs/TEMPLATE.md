# RF-DOMINIO-NNN: Nombre del Requisito

## Descripción
Explicación clara de qué debe hacer el sistema. Máximo 2-3 párrafos.

## Criterios de Aceptación
- [ ] Criterio 1 con comportamiento específico
- [ ] Criterio 2 con comportamiento específico
- [ ] Criterio 3 con comportamiento específico

## Impacto

### Módulos Afectados
- Web (Next.js: páginas / route handlers)
- Casos de uso (`src/modules/<dominio>`)
- Base de datos (Firestore, `db/`)
- Sync (`src/sync`)

### Dependencias
- Este requisito depende de: RF-DOMINIO-XXX (si aplica)

### Conflictos Potenciales
- Choca con: RF-OTRO-YYY (si aplica) — razón

## Notas Técnicas
- Consideraciones, restricciones, decisiones vigentes
- **Pendiente de decidir**: preguntas abiertas para el autor (se borran al resolverse)

## Implementación
<!-- Se rellena al implementar: lista de ficheros que lo implementan -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

---

**Pasos para crear un RF:**
1. Copiar este template a `docs/reqs/<DOMINIO>/RF-<DOMINIO>-NNN.md`
2. Reemplazar placeholders
3. Verificar en el `README.md` del dominio que no exista otro igual ni choque con otro
4. Añadir su línea al `README.md` del dominio
