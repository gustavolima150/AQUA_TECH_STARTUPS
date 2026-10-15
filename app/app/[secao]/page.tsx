import { notFound } from "next/navigation";
import { WorkspaceView } from "@/components/workspace-view";
const allowed = ["calendario","reunioes","tarefas","equipe","roadmap","configuracoes"];
export default async function SectionPage({params}:{params:Promise<{secao:string}>}) {
  const {secao} = await params;
  if (!allowed.includes(secao)) notFound();
  return <WorkspaceView secao={secao}/>;
}
