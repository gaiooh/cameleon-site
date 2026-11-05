import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

// Uma única família tipográfica. "opsz" e "wdth" ajustam o desenho das letras:
// títulos grandes ficam finos e elegantes, textos pequenos continuam legíveis.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

export const metadata: Metadata = {
  title: "Cameleon — Identidade visual para empresas",
  description:
    "Sites profissionais, redes sociais repaginadas e perfil completo no Google Maps. A Cameleon adapta a identidade visual da sua empresa a cada lugar onde ela aparece.",
};

export const viewport: Viewport = {
  themeColor: "#030307",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
