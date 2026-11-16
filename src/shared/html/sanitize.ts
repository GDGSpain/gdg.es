/**
 * RF-CHAPTERS-002: saneado del HTML que viene de gdg.community.dev antes de mostrarlo (contenido de
 * terceros, no confiable). Solo deja formato básico y enlaces http(s), que abren en pestaña nueva con
 * `rel="noopener noreferrer nofollow"`.
 */
import sanitizeHtml from "sanitize-html";

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "div",
    "span",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "ul",
    "ol",
    "li",
    "a",
    "h3",
    "h4",
    "blockquote",
  ],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  disallowedTagsMode: "discard",
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer nofollow" }),
    h1: "h3",
    h2: "h3",
  },
  exclusiveFilter: (frame) =>
    ["p", "div", "span"].includes(frame.tag) && !frame.text.trim() && !frame.mediaChildren?.length,
};

/**
 * Sanea HTML de terceros.
 * @param html HTML de la fuente
 * @returns HTML seguro para insertar
 */
export function sanitizeSourceHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS).trim();
}
