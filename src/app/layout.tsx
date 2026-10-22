import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MW Aprende | Conhecimento para transformar o futuro",
  description: "Aulas, exercícios e apoio para aprender no seu ritmo."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
