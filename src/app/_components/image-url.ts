/**
 * RF-CHAPTERS-001/002, RF-SYNC-003: ¿se puede pintar esta URL con next/image?
 * Debe coincidir con `images.remotePatterns` de next.config.ts; si no, next/image falla.
 */
export function isAllowedImageUrl(url: string | null): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      u.hostname === "res.cloudinary.com" &&
      u.pathname.startsWith("/startup-grind/")
    );
  } catch {
    return false;
  }
}
