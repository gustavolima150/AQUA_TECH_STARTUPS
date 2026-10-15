"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Agenda, Meeting, Task, Milestone, Member, Profile, Invitation } from "@/lib/types";
const db=createClient();
export function useWorkspaceData(workspaceId?:string){
 const [meetings,setMeetings]=useState<Meeting[]>([]),[agendas,setAgendas]=useState<Agenda[]>([]),[tasks,setTasks]=useState<Task[]>([]),[milestones,setMilestones]=useState<Milestone[]>([]),[members,setMembers]=useState<Member[]>([]),[profiles,setProfiles]=useState<Profile[]>([]),[invites,setInvites]=useState<Invitation[]>([]);
 const [loading,setLoading]=useState(true),[error,setError]=useState("");
 const reload=useCallback(async()=>{
   if(!workspaceId){setMeetings([]);setAgendas([]);setTasks([]);setMilestones([]);setMembers([]);setProfiles([]);setInvites([]);setLoading(false);return;}
   setLoading(true);setError("");
   const [m,a,t,ms,mem,inv]=await Promise.all([
      db.from("meetings").select("*").eq("workspace_id",workspaceId).order("scheduled_at",{ascending:true}).limit(500),
      db.from("agenda_items").select("*").eq("workspace_id",workspaceId).order("created_at",{ascending:true}).limit(1000),
      db.from("tasks").select("*").eq("workspace_id",workspaceId).order("created_at",{ascending:false}).limit(1000),
      db.from("milestones").select("*").eq("workspace_id",workspaceId).order("due_date",{ascending:true}).limit(300),
      db.from("members").select("*").eq("workspace_id",workspaceId).limit(300),
      db.from("invitations").select("id,email,role,token,expires_at,accepted_at,created_at").eq("workspace_id",workspaceId).order("created_at",{ascending:false}).limit(100)
   ]);
   const all=[m,a,t,ms,mem];const failure=all.find(r=>r.error)?.error;
   if(failure){setError(failure.message);setLoading(false);return;}
   setMeetings(m.data as Meeting[]||[]);setAgendas(a.data as Agenda[]||[]);setTasks(t.data as Task[]||[]);setMilestones(ms.data as Milestone[]||[]);setMembers(mem.data as Member[]||[]);setInvites(inv.data as Invitation[]||[]);
   const ids=(mem.data||[]).map(x=>x.user_id);
   if(ids.length){const p=await db.from("profiles").select("id,full_name,email").in("id",ids);if(p.error)setError(p.error.message);setProfiles(p.data as Profile[]||[])}else setProfiles([]);
   setLoading(false);
 },[workspaceId]);
 useEffect(()=>{void reload()},[reload]);
 return {meetings,agendas,tasks,milestones,members,profiles,invites,loading,error,reload};
}
