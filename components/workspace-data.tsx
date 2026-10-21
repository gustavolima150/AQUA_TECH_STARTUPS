"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Agenda, Meeting, Task, Milestone, Member, Profile, Invitation } from "@/lib/types";
const db=createClient();
type WorkspaceData={
 meetings:Meeting[];agendas:Agenda[];tasks:Task[];milestones:Milestone[];
 members:Member[];profiles:Profile[];invites:Invitation[];
};
const emptyData:WorkspaceData={meetings:[],agendas:[],tasks:[],milestones:[],members:[],profiles:[],invites:[]};
const cache=new Map<string,{data:WorkspaceData;updatedAt:number}>();
const cacheDuration=30_000;
export function useWorkspaceData(workspaceId?:string){
 const [data,setData]=useState<WorkspaceData>(()=>workspaceId?cache.get(workspaceId)?.data||emptyData:emptyData);
 const [loading,setLoading]=useState(()=>Boolean(workspaceId&&!cache.has(workspaceId))),[error,setError]=useState("");
 const requestId=useRef(0);
 const load=useCallback(async(force:boolean)=>{
   const currentRequest=++requestId.current;
   if(!workspaceId){setData(emptyData);setLoading(false);setError("");return;}
   const cached=cache.get(workspaceId);
   if(cached){
     setData(cached.data);
     if(!force&&Date.now()-cached.updatedAt<cacheDuration){setLoading(false);setError("");return;}
   }
   if(force||!cached)setLoading(true);
   setError("");
   const [m,a,t,ms,mem,inv]=await Promise.all([
      db.from("meetings").select("*").eq("workspace_id",workspaceId).order("scheduled_at",{ascending:true}).limit(500),
      db.from("agenda_items").select("*").eq("workspace_id",workspaceId).order("created_at",{ascending:true}).limit(1000),
      db.from("tasks").select("*").eq("workspace_id",workspaceId).order("created_at",{ascending:false}).limit(1000),
      db.from("milestones").select("*").eq("workspace_id",workspaceId).order("due_date",{ascending:true}).limit(300),
      db.from("members").select("*").eq("workspace_id",workspaceId).limit(300),
      db.from("invitations").select("id,email,role,token,expires_at,accepted_at,created_at").eq("workspace_id",workspaceId).order("created_at",{ascending:false}).limit(100)
   ]);
   const all=[m,a,t,ms,mem];const failure=all.find(r=>r.error)?.error;
   if(currentRequest!==requestId.current)return;
   if(failure){cache.delete(workspaceId);setError(failure.message);setLoading(false);return;}
   const next:WorkspaceData={
     meetings:m.data as Meeting[]||[],agendas:a.data as Agenda[]||[],tasks:t.data as Task[]||[],
     milestones:ms.data as Milestone[]||[],members:mem.data as Member[]||[],
     profiles:[],invites:inv.data as Invitation[]||[]
   };
   let profileError="";
   const ids=(mem.data||[]).map(x=>x.user_id);
   if(ids.length){const p=await db.from("profiles").select("id,full_name,email").in("id",ids);if(currentRequest!==requestId.current)return;if(p.error)profileError=p.error.message;next.profiles=p.data as Profile[]||[]}
   if(profileError)cache.delete(workspaceId);else cache.set(workspaceId,{data:next,updatedAt:Date.now()});
   setData(next);
   if(profileError)setError(profileError);
   setLoading(false);
 },[workspaceId]);
 useEffect(()=>{void load(false);return()=>{requestId.current++}},[load]);
 const reload=useCallback(()=>load(true),[load]);
 return {...data,loading,error,reload};
}
