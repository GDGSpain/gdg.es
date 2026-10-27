# ADR-0004: Los datos se importan a una BD propia; la web nunca consulta la fuente al servir

- **Estado**: Aceptada
- **Fecha**: 2026-10-27
- **RF relacionados**: RF-SYNC-001…005

## Contexto

La fuente (gdg.community.dev) es de terceros: su estructura puede cambiar, puede limitar el tráfico y no
ofrece datos agregados para España (sponsors compartidos, mapa). Consultarla en cada visita haría la web
lenta y frágil.

## Decisión

Un job programado importa capítulos, organizadores y eventos **solo de España** a nuestra base de datos (ADR-0008) con upsert
por id de origen. Las páginas leen exclusivamente de nuestra BD. Cada dato guarda su `sourceUrl` y
`syncedAt`.

## Alternativas descartadas

- **Proxy en tiempo real a la fuente**: latencia, fragilidad y carga sobre un tercero.

## Consecuencias

- La web funciona aunque la fuente caiga; los datos tienen un retraso máximo igual al intervalo del job.
- Hay que detectar bajas (capítulos u organizadores que desaparecen de la fuente): RF-SYNC-005.
