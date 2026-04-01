import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "RecurreYa — Recurre tu multa de tráfico por 4,99€",
  description:
    "Analizamos tu multa de tráfico con IA y generamos un escrito de recurso profesional en minutos. Solo pagas si hay argumentos.",
  keywords:
    "recurrir multa tráfico, recurso multa, alegaciones multa, recurreya",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${geist.variable} antialiased`}>{children}</body>
    </html>
  );
}
