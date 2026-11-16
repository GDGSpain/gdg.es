import type { Metadata } from "next";
import { SiteFooter } from "./_components/site-footer";
import { SiteHeader } from "./_components/site-header";
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
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
