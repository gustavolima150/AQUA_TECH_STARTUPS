"use client";
import { X, LoaderCircle, Sparkles } from "lucide-react";
import { type ReactNode, type FormEvent } from "react";
export function Panel({children,className=""}:{children:ReactNode;className?:string}){return <div className={`panel ${className}`}>{children}</div>}
export function SectionHead({eyebrow,title,description,action}:{eyebrow?:string;title:string;description?:string;action?:ReactNode}) {
  return <div className="section-head"><div>{eyebrow&&<p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description&&<p className="subtext">{description}</p>}</div>{action&&<div className="section-actions">{action}</div>}</div>;
}
export function Pill({children,tone="neutral"}:{children:ReactNode;tone?:"neutral"|"green"|"amber"|"purple"|"red"}) {return <span className={`pill pill-${tone}`}>{children}</span>}
export function Empty({title,description,action}:{title:string;description?:string;action?:ReactNode}){return <div className="empty"><div className="empty-mark"><Sparkles size={23}/></div><h3>{title}</h3>{description&&<p>{description}</p>}{action}</div>}
export function Modal({open,onClose,title,subtitle,children}:{open:boolean;onClose:()=>void;title:string;subtitle?:string;children:ReactNode}) {
 if(!open) return null;
 return <div className="modal-backdrop" onMouseDown={(e)=>{if(e.target===e.currentTarget)onClose()}} role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-label={title}><div className="modal-top"><div><h2>{title}</h2>{subtitle&&<p className="subtext">{subtitle}</p>}</div><button className="icon-btn" onClick={onClose} aria-label="Fechar"><X size={20}/></button></div>{children}</div></div>;
}
export function Submit({loading,children}:{loading:boolean;children:ReactNode}) {return <button type="submit" className="btn btn-primary" disabled={loading}>{loading&&<LoaderCircle size={16} className="spin"/>}{children}</button>}
export function Notice({type="error",children}:{type?:"error"|"success";children:ReactNode}){return <div role="status" className={`notice notice-${type}`}>{children}</div>}
export function FormField({label,children}:{label:string;children:ReactNode}){return <label className="form-field"><span>{label}</span>{children}</label>}
export type Handler = (event:FormEvent<HTMLFormElement>)=>void;
