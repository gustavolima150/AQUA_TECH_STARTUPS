export type Role = "owner" | "admin" | "manager" | "member" | "viewer";
export type Workspace = { id: string; name: string; description: string; created_by: string; created_at: string };
export type Member = { workspace_id: string; user_id: string; role: Role; job_title: string; joined_at: string };
export type Profile = { id: string; full_name: string; email: string };
export type Meeting = { id:string; workspace_id:string; title:string; description:string; scheduled_at:string; location:string; status:"planned"|"completed"|"cancelled"; created_at:string; created_by:string };
export type Agenda = { id:string; workspace_id:string; meeting_id:string; title:string; details:string; decision:string; done:boolean; created_at:string };
export type Task = { id:string; workspace_id:string; title:string; description:string; status:"todo"|"doing"|"done"; priority:"low"|"medium"|"high"; due_date:string|null; assignee_id:string|null; created_at:string; created_by:string };
export type Milestone = { id:string; workspace_id:string; title:string; description:string; due_date:string|null; progress:number; created_at:string };
export type Invitation = { id:string; email:string; role:Role; token:string; expires_at:string; accepted_at:string|null; created_at:string };
export const roleLabels: Record<Role,string> = {owner:"Proprietário",admin:"Administrador",manager:"Gestor",member:"Membro",viewer:"Visualização"};
export const canEdit = (role?:Role) => !!role && role !== "viewer";
export const canManage = (role?:Role) => role === "owner" || role === "admin";
export function formatDate(date?:string|null, options?:Intl.DateTimeFormatOptions) {
  if(!date) return "Sem data";
  // Datas SQL (YYYY-MM-DD) são tratadas em horário local, evitando deslocamentos por UTC.
  const d = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(date+"T12:00:00") : new Date(date);
  return new Intl.DateTimeFormat("pt-BR", options ?? {day:"2-digit",month:"short",year:"numeric"}).format(d);
}
export function prettyDateTime(date:string) { return formatDate(date, {day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}); }
export function initials(str:string) { return str.trim().split(/\s+/).slice(0,2).map(s=>s[0]?.toUpperCase()||"").join("") || "N"; }
export function formatDayLocal(date:Date) {return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;}
export function todayLocal(){return formatDayLocal(new Date());}
export function localDateTimeInput(date:Date){return `${formatDayLocal(date)}T${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}`;}
