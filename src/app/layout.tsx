import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GDG España", template: "%s · GDG España" },
  description:
    "Directorio de los Google Developer Groups de España: capítulos, organizadores, sponsors y mapa de eventos.",
  metadataBase: new URL("https://gdg.es"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
