"use client";
import { useState } from "react";
import { Building2, LockKeyhole, UserCircle2, ShieldCheck } from "lucide-react";
import type { ViewProps } from "@/components/workspace-view";
import { canManage, roleLabels } from "@/lib/types";
import { FormField, Notice, Panel, SectionHead, Submit } from "@/components/ui";
import { useWorkspace } from "@/components/workspace-provider";
import { createClient } from "@/lib/supabase/client";
const db=createClient();
export function Settings({workspace,role,user,refreshWorkspace}:ViewProps){
 const {profile,refresh}=useWorkspace(),[name,setName]=useState(workspace.name),[desc,setDesc]=useState(workspace.description||""),[fullName,setFullName]=useState(profile?.full_name||""),[busy,setBusy]=useState(false),[error,setError]=useState(""),[success,setSuccess]=useState("");
 async function updateWorkspace(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError("");setSuccess("");const {error}=await db.from("workspaces").update({name:name.trim(),description:desc.trim()}).eq("id",workspace.id);if(error)setError(error.message);else {await refreshWorkspace();setSuccess("Informações da startup atualizadas.")}setBusy(false)}
 async function updateProfile(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError("");setSuccess("");const {error}=await db.from("profiles").update({full_name:fullName.trim()}).eq("id",user.id);if(error)setError(error.message);else{await refresh();setSuccess("Seu perfil foi atualizado.")}setBusy(false)}
 return <><SectionHead eyebrow="PREFERÊNCIAS" title="Configurações" description="Gerencie seu perfil, as informações da startup e as regras de acesso."/>
 {error&&<Notice>{error}</Notice>}{success&&<Notice type="success">{success}</Notice>}
 <div className="settings-grid"><Panel><div className="setting-heading"><span className="setting-icon"><Building2 size={21}/></span><div><h2>Informações da startup</h2><p>Dados visíveis aos membros deste espaço.</p></div></div><form className="stack" onSubmit={updateWorkspace}><FormField label="Nome"><input maxLength={100} required minLength={2} value={name} onChange={e=>setName(e.target.value)} disabled={!canManage(role)}/></FormField><FormField label="Descrição"><textarea maxLength={500} rows={4} value={desc} onChange={e=>setDesc(e.target.value)} disabled={!canManage(role)}/></FormField><div className="form-actions">{canManage(role)&&<Submit loading={busy}>Salvar alterações</Submit>}</div></form></Panel><Panel><div className="setting-heading"><span className="setting-icon"><UserCircle2 size={21}/></span><div><h2>Meu perfil</h2><p>Personalize como você aparece para a equipe.</p></div></div><form className="stack" onSubmit={updateProfile}><FormField label="Nome completo"><input maxLength={120} value={fullName} onChange={e=>setFullName(e.target.value)}/></FormField><FormField label="E-mail verificado"><input disabled value={user.email||""}/></FormField><FormField label="Meu papel neste espaço"><input disabled value={role?roleLabels[role]:""}/></FormField><div className="form-actions"><Submit loading={busy}>Salvar perfil</Submit></div></form></Panel></div>
 <Panel className="security-panel"><span className="security-icon"><ShieldCheck size={24}/></span><div><h2>Segurança por padrão</h2><p>As áreas internas exigem autenticação. O banco utiliza regras de acesso por equipe (RLS), e a inclusão de novos integrantes exige convite associado a um e-mail confirmado. As senhas não são armazenadas por este aplicativo.</p></div><LockKeyhole size={20}/></Panel>
 </>
}
