import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteFooter } from "@/ui/layout/SiteFooter";
import { SiteHeader } from "@/ui/layout/SiteHeader";
import { CartDrawer } from "@/ui/cart/CartDrawer";

export const metadata: Metadata = {
  title: "Daniel Kéa",
  description: "Casa de moda contemporánea. Edición, silueta y precisión.",
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fontSans.variable} ${fontSerif.variable}`}>
      <body>
        <Providers>
          <SiteHeader />
          {children}
          <CartDrawer />
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
