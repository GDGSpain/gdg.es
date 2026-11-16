import Image from "next/image";
import styles from "./chapter-logo.module.css";

/** Logo del capítulo, o sus iniciales si la fuente no tiene logo (RF-CHAPTERS-001/002). */
export function ChapterLogo({
  title,
  logoUrl,
  size = 56,
}: {
  title: string;
  logoUrl: string | null;
  size?: number;
}) {
  const usable =
    logoUrl && new URL(logoUrl).hostname === "res.cloudinary.com" && !/DefaultChapterThumbnail/.test(logoUrl);
  if (usable) {
    return <Image className={styles.logo} src={logoUrl} alt="" width={size} height={size} />;
  }
  const initials = title
    .replace(/^GDG( on Campus)?\s*/i, "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span className={styles.fallback} style={{ width: size, height: size }} aria-hidden="true">
      {initials || "G"}
    </span>
  );
}
