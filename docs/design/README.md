# Diseño: tokens

Los tokens viven en [`src/app/tokens.css`](../../src/app/tokens.css) como CSS custom properties y se
cargan desde `globals.css`. Los componentes usan solo los **semánticos** (`--color-*`, `--font-*`,
`--space-*`, `--radius-*`, `--duration-*`…); los primitivos (`--gdg-*`) no se usan fuera de ese fichero.

## Origen

Medidos el 2026-11-09 en [gdg.community.dev](https://gdg.community.dev/) (sus variables
`--theme-palette-*`, `--SpacingGap*`, `--Radius*`, `--general-button-*` y estilos computados), para que
gdg.es se sienta parte del ecosistema oficial de los GDG.

| Qué | gdg.community.dev | gdg.es |
|---|---|---|
| Azul de marca | `#4285F4` (primary) | `--gdg-blue-500`, decorativo y foco |
| Botón principal | `#1A73E8`, texto blanco, radio 4, padding 15/20, 14 px peso 500 | Igual: `--color-action`, `--button-*` |
| Hover del botón | `#4285F4` con texto blanco | **`#1967D2`**: el original da 3,56:1 y no llega a AA |
| Texto | `#5F6368` cuerpo, `#202124` títulos | `--color-text-muted`, `--color-text` |
| Bordes | `#DADCE0` (claros), `#9AA0A6` | `--color-border`; para controles **`#80868B`** (3:1) |
| Superficie suave | `#F1F3F4` | `--color-surface-muted` |
| Estados | success `#008A00`, warning `#F3BE02`, error `#E3000F` | Igual |
| Tipografía | "Google Sans", "Open Sans"; h1 44/48,4; h2 29,4; párrafo 16/24; peso 400 en títulos | Igual, con escala redondeada (h2 28) |
| Espaciado | Escala de 4 px (`--SpacingGap01…25`) | `--space-1…25` |
| Radios | 4 botones, 8 paneles, 16 chips, 24, 50 % avatares | `--radius-xs…2xl`, `--radius-full` |
| Elevación | Sin sombras, con bordes de 1 px | Igual; `--shadow-1/2` solo para capas flotantes |
| Colores Google | Rojo, amarillo y verde en ilustraciones | `--color-accent-*` (decoración y marcadores del mapa, nunca texto sobre blanco) |

## Decisiones propias

- **Contraste AA garantizado por test**: `src/app/tokens.test.ts` comprueba los pares texto/fondo en
  modo claro y oscuro (4,5:1 texto, 3:1 bordes de controles). Cambiar un color que rompa el contraste
  hace fallar el CI. El test ya obligó a corregir tres pares: borde de controles en claro y en oscuro, y
  texto atenuado sobre superficie atenuada en oscuro.
- **Modo oscuro** (la web original no tiene): grises oscuros de Google y azul `#8AB4F8` para la acción,
  según `prefers-color-scheme`.
- **Movimiento**: duraciones 120/200/300 ms y curvas estándar, entrada y salida; con
  `prefers-reduced-motion` las duraciones pasan a 0. Es la base para la skill `emil-design-eng`.
- **Fuente**: se declara la pila "Google Sans" → "Open Sans" → fuentes del sistema, sin descargar ninguna
  todavía. **Pendiente**: confirmar la licencia de uso de Google Sans para la web de GDG Spain (kit de
  marca de GDG) o cargar Open Sans con `next/font`.
- **Logos**: los de GDG y de cada capítulo siguen el kit de marca oficial; no se recolorean con los tokens.

## Cómo se usan

```css
.card {
  background: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--card-radius);
  padding: var(--space-6);
  transition: border-color var(--duration-fast) var(--ease-standard);
}
.card:hover {
  border-color: var(--color-border-strong);
}
```

Las skills de diseño (`design-taste-frontend`, `impeccable`, `emil-design-eng`) parten de estos tokens: si
proponen un valor nuevo, se añade aquí como token antes de usarlo.
