/**
 * Resultado de un caso de uso: éxito con valor o fallo con error de negocio (ADR-0006).
 * Los casos de uso no lanzan para el flujo de negocio; devuelven `Result` y la capa HTTP/render lo traduce.
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

/** Construye un resultado de éxito. */
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

/** Construye un resultado de fallo. */
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

/**
 * Transforma el valor de un éxito y deja pasar el fallo sin tocarlo.
 * @param result resultado de partida
 * @param fn transformación del valor
 * @returns nuevo resultado
 */
export function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return result.ok ? ok(fn(result.value)) : result;
}
