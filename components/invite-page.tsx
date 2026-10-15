"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, MailCheck, Sparkles, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Notice } from "@/components/ui";
export function InvitePage({codigo}:{codigo:string}){
 const router=useRouter(),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{let mounted=true;async function go(){const db=createClient();const {data:{user}}=await db.auth.getUser();if(!mounted)return;
 if(!user){router.replace(`/entrar?next=${encodeURIComponent(`/convite/${codigo}`)}`);return}
 if(!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(codigo)){setError("Código do convite inválido.");setLoading(false);return}
 const {data,error}=await db.rpc("accept_invite",{invite_token:codigo});if(!mounted)return;
 if(error){setError(error.message);setLoading(false)}else{localStorage.setItem("nexo:workspace",data as string);router.replace("/app");router.refresh()}}
 void go();return()=>{mounted=false}},[codigo,router]);
 return <div className="invite-page"><Link className="brand" href="/"><span className="brand-logo"><Sparkles size={19}/></span>nexo<span className="brand-dot">.</span></Link><div className="invite-box"><div className="auth-icon"><Users size={24}/></div><h1>Convite para colaborar</h1><p>A comunidade de inovação fica ainda melhor com você por perto.</p>{loading?<span className="loading-invite"><LoaderCircle className="spin" size={17}/> Validando seu convite...</span>:<><Notice>{error}</Notice><Link className="btn btn-primary" href="/app">Ir para meu painel</Link></>}</div></div>
}
