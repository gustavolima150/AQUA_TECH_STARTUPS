"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
type Theme="light"|"dark";
export function ThemeToggle(){
 const [theme,setTheme]=useState<Theme>("dark");
 useEffect(()=>{setTheme(document.documentElement.dataset.theme==="dark"?"dark":"light")},[]);
 const toggle=()=>{const next=theme==="dark"?"light":"dark";setTheme(next);document.documentElement.dataset.theme=next;localStorage.setItem("nexo:theme",next)};
 return <button type="button" className="theme-toggle" onClick={toggle} aria-label={theme==="dark"?"Ativar tema claro":"Ativar tema escuro"} title={theme==="dark"?"Tema claro":"Tema escuro"}>{theme==="dark"?<Sun size={19}/>:<Moon size={19}/>}<span>{theme==="dark"?"Claro":"Escuro"}</span></button>;
}
