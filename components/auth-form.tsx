"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles, ShieldCheck, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Notice, Submit } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
type Mode="login"|"register"|"forgot"|"reset";
const text={login:{title:"Que bom ter você de volta.",desc:"Entre para continuar construindo o futuro com sua equipe.",button:"Entrar na plataforma"},register:{title:"Sua próxima grande ideia começa aqui.",desc:"Crie sua conta e tenha um lugar para organizar tudo.",button:"Criar minha conta"},forgot:{title:"Recupere seu acesso.",desc:"Enviaremos um link de recuperação para seu e-mail.",button:"Enviar link de recuperação"},reset:{title:"Crie uma nova senha.",desc:"Escolha uma senha forte para proteger sua conta.",button:"Atualizar senha"}};
export function AuthForm({mode}:{mode:Mode}){
 const router=useRouter(),[awaitingCode,setAwaitingCode]=useState(false),[code,setCode]=useState(""),[verifying,setVerifying]=useState(false),[resending,setResending]=useState(false),[name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[showPassword,setShowPassword]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[success,setSuccess]=useState("");
 useEffect(()=>{if(typeof window!=="undefined"&&new URLSearchParams(window.location.search).get("erro")==="confirmacao")setError("Link de confirmação inválido ou expirado. Solicite outro e-mail de confirmação.")},[]);
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setError("");setSuccess("");setBusy(true);const db=createClient();
  try{
    if(mode==="login"){
      const {data,error}=await db.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;
      if(!data.user?.email_confirmed_at){await db.auth.signOut();throw new Error("Confirme seu e-mail antes de acessar.")}
      const q=new URLSearchParams(window.location.search).get("next");
      router.replace(q&&q.startsWith("/convite/")&&!q.startsWith("//")?q:"/app");router.refresh();
    }else if(mode==="register"){
      if(password.length<10)throw new Error("Use no mínimo 10 caracteres na senha.");
      const {error}=await db.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:window.location.origin,data:{full_name:name.trim()}}});if(error)throw error;
      setAwaitingCode(true);setSuccess("");
    }else if(mode==="forgot"){
      const {error}=await db.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin});if(error)throw error;
      setSuccess("Se esse endereço estiver cadastrado, você receberá instruções para redefinir a senha.");
    }else{
      if(password.length<10)throw new Error("Use no mínimo 10 caracteres na senha.");
      const {error}=await db.auth.updateUser({password});if(error)throw error;
      setSuccess("Senha atualizada! Agora você pode acessar sua conta.");await db.auth.signOut();
    }
  }catch(e){setError(e instanceof Error?e.message:"Algo deu errado. Tente novamente.")}finally{setBusy(false)}
 }
 async function confirmCode(e:React.FormEvent<HTMLFormElement>){
   e.preventDefault();setError("");setVerifying(true);
   try { const {error}=await createClient().auth.verifyOtp({email:email.trim(),token:code.trim(),type:"email"});
     if(error)throw error;
     router.replace("/app");router.refresh();
   } catch(e){setError(e instanceof Error?e.message:"Código inválido ou expirado.")}
   finally {setVerifying(false)}
 }
 async function resendCode(){
   setError("");setResending(true);
   try {const {error}=await createClient().auth.resend({type:"signup",email:email.trim()});if(error)throw error;setSuccess("Um novo código foi solicitado. Confira sua caixa de entrada.")}
   catch(e){setError(e instanceof Error?e.message:"Não foi possível reenviar. Aguarde e tente novamente.")}
   finally{setResending(false)}
 }
 return <div className="auth-layout"><aside className="auth-visual"><Link className="brand brand-white" href="/"><span className="brand-logo"><Sprout size={20}/></span><span>nexo<span className="brand-dot">.</span></span></Link><div className="auth-visual-center"><div className="auth-visual-badge">✦ SEU HUB DE INOVAÇÃO</div><h2>Boas ideias<br/>merecem <em>grandes</em><br/>execuções.</h2><p>Projetos, pessoas e decisões fluindo na mesma direção.</p><div className="auth-glass"><span className="auth-glass-dot"/><div><b>O futuro está em construção</b><small>Você faz parte dessa jornada</small></div><ArrowRight size={19}/></div></div><p className="auth-footer">© {new Date().getFullYear()} Nexo · Startup Operating System</p></aside>
 <main className="auth-main"><div className="auth-theme-switch"><ThemeToggle/></div><div className="auth-mobile-logo"><Link className="brand" href="/"><span className="brand-logo"><Sprout size={19}/></span>nexo<span className="brand-dot">.</span></Link></div><div className="auth-box"><span className="auth-icon"><LockKeyhole size={21}/></span><p className="eyebrow">{mode==="login"?"BEM-VINDO DE VOLTA":mode==="register"?"CRIE SUA CONTA":"ACESSO À CONTA"}</p><h1>{text[mode].title}</h1><p className="subtext">{text[mode].desc}</p>
 {mode==="register"&&awaitingCode?<div className="verification-wrap"><p className="eyebrow">ÚLTIMA ETAPA · VERIFICAÇÃO</p><h2>Confirme seu e-mail</h2><p className="subtext">Enviamos um código de 6 dígitos para <strong>{email}</strong>. Digite-o abaixo para ativar sua conta.</p><form className="auth-form" onSubmit={confirmCode}><label>Código de confirmação<input autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} minLength={6} required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="000000" className="otp-input"/></label>{error&&<Notice>{error}</Notice>}{success&&<Notice type="success">{success}</Notice>}<Submit loading={verifying}>Validar código <ShieldCheck size={18}/></Submit></form><button type="button" className="btn btn-ghost resend-code" disabled={resending} onClick={resendCode}>{resending?"Solicitando novo código...":"Reenviar código"}</button><button type="button" className="change-email" onClick={()=>{setAwaitingCode(false);setCode("");setError("");setSuccess("")}}>Corrigir endereço de e-mail</button></div>:success?<div className="auth-success"><ShieldCheck size={27}/><h3>Tudo certo!</h3><p>{success}</p><Link className="btn btn-primary" href="/entrar">Ir para o login <ArrowRight size={17}/></Link></div>:
 <form className="auth-form" onSubmit={submit}>{mode==="register"&&<label>Nome completo<input required maxLength={120} placeholder="Como podemos chamar você?" value={name} onChange={e=>setName(e.target.value)}/></label>}{mode!=="reset"&&<label>E-mail<div className="input-icon-wrap"><Mail size={17}/><input autoComplete="email" type="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@startup.com"/></div></label>}{mode!=="forgot"&&<label>{mode==="reset"?"Nova senha":"Senha"}<div className="input-icon-wrap"><LockKeyhole size={17}/><input type={showPassword?"text":"password"} required minLength={mode==="login"?1:10} autoComplete={mode==="login"?"current-password":"new-password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder={mode==="login"?"Sua senha":"Pelo menos 10 caracteres"}/><button type="button" className="reveal-password" aria-label={showPassword?"Ocultar senha":"Mostrar senha"} onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>}{mode==="login"&&<Link className="forgot-link" href="/recuperar-senha">Esqueceu a senha?</Link>}{error&&<Notice>{error}</Notice>}<Submit loading={busy}>{text[mode].button}<ArrowRight size={18}/></Submit></form>}
 <div className="auth-switch">{mode==="login"?<>Ainda não tem conta? <Link href="/cadastro">Cadastre-se gratuitamente</Link></>:mode==="register"?<>Já tem uma conta? <Link href="/entrar">Fazer login</Link></>:<Link href="/entrar">Voltar para o login</Link>}</div><p className="auth-reassurance"><ShieldCheck size={16}/> Seu acesso é protegido e seus dados pertencem à sua equipe.</p></div></main></div>
}
