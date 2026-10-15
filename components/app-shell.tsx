"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, CalendarDays, ListTodo, UsersRound, Flag, Settings2, ChevronDown, Plus, Menu, X, LogOut, CalendarClock, Sparkles, Rocket } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useWorkspace } from "@/components/workspace-provider";
import { initials } from "@/lib/types";
import { FormField, Modal, Notice, Submit } from "@/components/ui";
const links=[
  {href:"/app",label:"Visão geral",icon:LayoutDashboard},
  {href:"/app/calendario",label:"Calendário",icon:CalendarDays},
  {href:"/app/reunioes",label:"Reuniões e pautas",icon:CalendarClock},
  {href:"/app/tarefas",label:"Tarefas",icon:ListTodo},
  {href:"/app/equipe",label:"Minha equipe",icon:UsersRound},
  {href:"/app/roadmap",label:"Roadmap",icon:Flag},
  {href:"/app/configuracoes",label:"Configurações",icon:Settings2}
];
export function AppShell({children}:{children:ReactNode}){
 const {workspaces,active,profile,user,switchWorkspace,refresh}=useWorkspace();
 const path=usePathname(),router=useRouter();
 const [menu,setMenu]=useState(false),[choose,setChoose]=useState(false),[create,setCreate]=useState(false),[name,setName]=useState(""),[desc,setDesc]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
 async function addWorkspace(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(!user)return;setBusy(true);setError("");
   const {data,error}=await createClient().from("workspaces").insert({name:name.trim(),description:desc.trim(),created_by:user.id}).select("id").single();
   if(error)setError(error.message);else {await refresh();switchWorkspace(data.id);setCreate(false);setName("");setDesc("");router.push("/app")}
   setBusy(false);
 }
 return <div className="shell">
 <aside className={`sidebar ${menu?"sidebar-open":""}`}>
   <div className="sidebar-brand"><Link href="/app" className="brand brand-white"><span className="brand-logo"><Sparkles size={19}/></span><span>nexo<span className="brand-dot">.</span></span></Link><button className="mobile-close icon-btn" onClick={()=>setMenu(false)} aria-label="Fechar menu"><X/></button></div>
   <div className="workspace-chooser"><button className="workspace-trigger" onClick={()=>setChoose(!choose)} aria-expanded={choose}><span className="workspace-emblem"><Rocket size={18}/></span><span className="workspace-name"><small>ESPAÇO DE TRABALHO</small><b>{active?.name||"Minha startup"}</b></span><ChevronDown size={16}/></button>
    {choose&&<div className="workspace-dropdown">{workspaces.map(w=><button key={w.id} className={w.id===active?.id?"selected":""} onClick={()=>{switchWorkspace(w.id);setChoose(false);setMenu(false)}}>{w.name}</button>)}<button className="workspace-add" onClick={()=>{setCreate(true);setChoose(false)}}><Plus size={14}/> Nova startup</button></div>}
   </div>
   <div className="sidebar-label">MENU PRINCIPAL</div><nav className="side-nav">{links.map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={()=>setMenu(false)} className={`nav-link ${path===href?"active":""}`}><Icon size={19}/>{label}{path===href&&<span className="active-dot"/>}</Link>)}</nav>
   <div className="sidebar-bottom"><div className="sidebar-tip"><div className="tip-icon"><Sparkles size={17}/></div><b>Ideias viram impacto.</b><p>Planeje bem, defina responsáveis e acompanhe cada avanço.</p></div><div className="sidebar-user"><span className="avatar avatar-dark">{initials(profile?.full_name||user?.email||"U")}</span><span className="user-info"><b>{profile?.full_name||"Minha conta"}</b><small>{user?.email}</small></span><button className="logout" aria-label="Sair" title="Sair" onClick={async()=>{await createClient().auth.signOut();router.replace("/entrar");router.refresh()}}><LogOut size={18}/></button></div></div>
 </aside>
 {menu&&<div className="mobile-overlay" onClick={()=>setMenu(false)}/>}
 <main className="workspace-main"><header className="topbar"><button className="mobile-menu icon-btn" onClick={()=>setMenu(true)} aria-label="Abrir menu"><Menu size={22}/></button><span className="breadcrumb">Workspace <span>/</span> {links.find(x=>x.href===path)?.label||"Painel"}</span><span className="topbar-right"><span className="today-label">{new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"2-digit",month:"long"}).format(new Date())}</span><span className="avatar avatar-top">{initials(profile?.full_name||user?.email||"U")}</span></span></header><div className="workspace-content">{children}</div></main>
 <Modal open={create} onClose={()=>setCreate(false)} title="Criar uma startup" subtitle="Cada startup terá dados e equipe separados."><form className="stack" onSubmit={addWorkspace}><FormField label="Nome da startup"><input required minLength={2} maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="Ex.: AquaTech Move" /></FormField><FormField label="Descrição (opcional)"><textarea maxLength={500} rows={3} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Em uma frase, qual é o propósito?"/></FormField>{error&&<Notice>{error}</Notice>}<div className="form-actions"><button type="button" className="btn btn-light" onClick={()=>setCreate(false)}>Cancelar</button><Submit loading={busy}>Criar startup</Submit></div></form></Modal>
 </div>
}
