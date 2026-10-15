import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Nexo | Startup OS", description: "Um espaço para transformar decisões em progresso." };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
