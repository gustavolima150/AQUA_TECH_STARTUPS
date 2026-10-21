import type { Metadata } from "next";
import "./globals.css";
import "./verdant.css";
export const metadata: Metadata = { title: "NEXO | Ideias que florescem", description: "Reuniões, tarefas, calendário, metas e equipe conectados. Um espaço inteligente para startups que querem crescer com clareza." };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="pt-BR" suppressHydrationWarning><body><script dangerouslySetInnerHTML={{__html:`(function(){try{var p=localStorage.getItem("nexo:theme");document.documentElement.dataset.theme=p==="dark"||p==="light"?p:"dark"}catch(e){document.documentElement.dataset.theme="dark"}})();`}} />{children}</body></html>;
}
