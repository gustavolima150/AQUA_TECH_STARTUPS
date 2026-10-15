"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Workspace, Member, Profile, Role } from "@/lib/types";
const supabase=createClient();
type Context={user:User|null;profile:Profile|null;workspaces:Workspace[];active:Workspace|null;role:Role|undefined;memberships:Member[];loading:boolean;error:string;refresh:()=>Promise<void>;switchWorkspace:(id:string)=>void};
const C=createContext<Context|null>(null);
export function WorkspaceProvider({children}:{children:ReactNode}){
  const [user,setUser]=useState<User|null>(null),[profile,setProfile]=useState<Profile|null>(null);
  const [workspaces,setWorkspaces]=useState<Workspace[]>([]),[memberships,setMemberships]=useState<Member[]>([]),[activeId,setActiveId]=useState("");
  const [loading,setLoading]=useState(true),[error,setError]=useState("");
  const refresh=useCallback(async()=>{
    setLoading(true);setError("");
    try{
      const {data:{user:u},error:ue}=await supabase.auth.getUser();if(ue||!u) throw new Error("Sessão encerrada. Entre novamente.");
      setUser(u);
      const [w,m,p]=await Promise.all([
        supabase.from("workspaces").select("id,name,description,created_by,created_at").order("created_at",{ascending:false}),
        supabase.from("members").select("workspace_id,user_id,role,joined_at").eq("user_id",u.id),
        supabase.from("profiles").select("id,full_name,email").eq("id",u.id).maybeSingle()
      ]);
      if(w.error)throw w.error;if(m.error)throw m.error;
      const ws=(w.data||[]) as Workspace[];setWorkspaces(ws);setMemberships((m.data||[]) as Member[]);setProfile(p.data as Profile|null);
      const stored=typeof window!=="undefined"?localStorage.getItem("nexo:workspace"):null;
      setActiveId(prev=>ws.some(x=>x.id===prev)?prev:ws.some(x=>x.id===stored)?stored!:ws[0]?.id||"");
    }catch(e){setError(e instanceof Error?e.message:"Não foi possível carregar seus dados.")}finally{setLoading(false)}
  },[]);
  useEffect(()=>{void refresh()},[refresh]);
  const switchWorkspace=useCallback((id:string)=>{setActiveId(id);localStorage.setItem("nexo:workspace",id)},[]);
  const active=useMemo(()=>workspaces.find(x=>x.id===activeId)||null,[workspaces,activeId]);
  const role=useMemo(()=>memberships.find(x=>x.workspace_id===activeId)?.role,[memberships,activeId]);
  return <C.Provider value={{user,profile,workspaces,active,role,memberships,loading,error,refresh,switchWorkspace}}>{children}</C.Provider>;
}
export function useWorkspace(){const ctx=useContext(C);if(!ctx)throw new Error("Provider não carregado");return ctx}
