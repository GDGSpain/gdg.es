import Image from "next/image";
import { isAllowedImageUrl } from "./image-url";
import styles from "./person-avatar.module.css";

/** Foto de un organizador, o sus iniciales si no tiene (RF-SYNC-003). */
export function PersonAvatar({
  name,
  avatarUrl,
  size = 56,
}: {
  name: string;
  avatarUrl: string | null;
  size?: number;
}) {
  if (isAllowedImageUrl(avatarUrl))
    return <Image className={styles.avatar} src={avatarUrl} alt="" width={size} height={size} />;
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span className={styles.fallback} style={{ width: size, height: size }} aria-hidden="true">
      {initials}
    </span>
  );
}
