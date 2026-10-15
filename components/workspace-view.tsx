"use client";
import { useWorkspace } from "@/components/workspace-provider";
import { useWorkspaceData } from "@/components/workspace-data";
import { Dashboard } from "@/components/views-dashboard";
import { CalendarView } from "@/components/views-calendar";
import { Meetings } from "@/components/views-meetings";
import { Tasks } from "@/components/views-tasks";
import { Team } from "@/components/views-team";
import { Roadmap } from "@/components/views-roadmap";
import { Settings } from "@/components/views-settings";
import { Empty, Notice } from "@/components/ui";
import { LoaderCircle, Plus, Rocket } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
export function WorkspaceView({secao}:{secao:string}){
 const ctx=useWorkspace(),data=useWorkspaceData(ctx.active?.id);const [name,setName]=useState(""),[creating,setCreating]=useState(false),[formError,setFormError]=useState("");
 if(ctx.loading) return <div className="center-state"><LoaderCircle className="spin"/> Carregando seu espaço...</div>;
 if(ctx.error)return <Notice>{ctx.error}</Notice>;
 if(!ctx.active)return <div className="onboarding"><span className="onboard-icon"><Rocket size={32}/></span><span className="eyebrow">SEU PRIMEIRO PASSO</span><h1>Grandes ideias precisam de um lugar para crescer.</h1><p>Crie sua primeira startup e reúna suas decisões, equipe, compromissos e metas em um único espaço.</p><form onSubmit={async e=>{e.preventDefault();if(!ctx.user)return;setCreating(true);setFormError("");const {data,error}=await createClient().from("workspaces").insert({name:name.trim(),created_by:ctx.user.id}).select("id").single();if(error)setFormError(error.message);else{await ctx.refresh();ctx.switchWorkspace(data.id)}setCreating(false)}}><input required minLength={2} maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="Nome da sua startup"/ ><button disabled={creating} className="btn btn-primary" type="submit"><Plus size={17}/> Criar meu espaço</button></form>{formError&&<Notice>{formError}</Notice>}</div>;
 if(data.loading)return <div className="center-state"><LoaderCircle className="spin"/> Preparando dados de {ctx.active.name}...</div>;
 if(data.error)return <Notice>{data.error}</Notice>;
 const common={...data,workspace:ctx.active,role:ctx.role,user:ctx.user!,refreshWorkspace:ctx.refresh};
 switch(secao){case "calendario":return <CalendarView {...common}/>;case "reunioes":return <Meetings {...common}/>;case "tarefas":return <Tasks {...common}/>;case "equipe":return <Team {...common}/>;case "roadmap":return <Roadmap {...common}/>;case "configuracoes":return <Settings {...common}/>;default:return <Dashboard {...common}/>}
}
export type ViewProps=Omit<ReturnType<typeof useWorkspaceData>,"loading"|"error"> & {workspace:NonNullable<ReturnType<typeof useWorkspace>["active"]>;role:ReturnType<typeof useWorkspace>["role"];user:NonNullable<ReturnType<typeof useWorkspace>["user"]>;refreshWorkspace:()=>Promise<void>};
