"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays, Clock3, Flag, ListTodo } from "lucide-react";
import { Panel, SectionHead, Empty, Pill } from "@/components/ui";
import type { ViewProps } from "@/components/workspace-view";
import { formatDate, formatDayLocal, todayLocal, prettyDateTime } from "@/lib/types";
type CalEvent={id:string;day:string;name:string;type:"meeting"|"task"|"milestone";meta:string};
export function CalendarView({meetings,tasks,milestones}:ViewProps){
 const [cursor,setCursor]=useState(new Date(new Date().getFullYear(),new Date().getMonth(),1));
 const [selected,setSelected]=useState(todayLocal());
 const events=useMemo<CalEvent[]>(()=>[
  ...meetings.filter(m=>m.status!=="cancelled").map(m=>({id:m.id,day:formatDayLocal(new Date(m.scheduled_at)),name:m.title,type:"meeting" as const,meta:prettyDateTime(m.scheduled_at)})),
  ...tasks.filter(t=>t.due_date&&t.status!=="done").map(t=>({id:t.id,day:t.due_date!,name:t.title,type:"task" as const,meta:t.status==="doing"?"Em andamento":"A fazer"})),
  ...milestones.filter(m=>m.due_date).map(m=>({id:m.id,day:m.due_date!,name:m.title,type:"milestone" as const,meta:`${m.progress}% concluído`}))
 ],[meetings,tasks,milestones]);
 const firstWeekday=new Date(cursor.getFullYear(),cursor.getMonth(),1).getDay();
 const daysInMonth=new Date(cursor.getFullYear(),cursor.getMonth()+1,0).getDate();
 const cells=Array.from({length:Math.ceil((firstWeekday+daysInMonth)/7)*7},(_,i)=>{
  const d=new Date(cursor.getFullYear(),cursor.getMonth(),i-firstWeekday+1);return {date:d,day:formatDayLocal(d),sameMonth:d.getMonth()===cursor.getMonth()};
 });
 const dayEvents=events.filter(e=>e.day===selected);
 return <><SectionHead eyebrow="VISÃO DE TEMPO" title="Calendário" description="Todos os compromissos, entregas e marcos importantes em um só lugar." action={<Link href="/app/reunioes" className="btn btn-primary"><CalendarDays size={17}/> Agendar reunião</Link>}/>
 <div className="calendar-layout"><Panel className="calendar-panel"><div className="calendar-toolbar"><div><p className="eyebrow">PLANEJAMENTO MENSAL</p><h2>{formatDate(formatDayLocal(cursor),{month:"long",year:"numeric"})}</h2></div><div className="calendar-nav"><button className="btn btn-light btn-small" onClick={()=>{const d=new Date();setCursor(new Date(d.getFullYear(),d.getMonth(),1));setSelected(todayLocal())}}>Hoje</button><button className="icon-btn" aria-label="Mês anterior" onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()-1,1))}><ChevronLeft/></button><button className="icon-btn" aria-label="Próximo mês" onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()+1,1))}><ChevronRight/></button></div></div>
 <div className="calendar-grid">{["DOM","SEG","TER","QUA","QUI","SEX","SÁB"].map(d=><div key={d} className="weekday">{d}</div>)}{cells.map(({date,day,sameMonth})=>{
  const dayE=events.filter(e=>e.day===day);return <button key={day} onClick={()=>{setSelected(day);if(!sameMonth)setCursor(new Date(date.getFullYear(),date.getMonth(),1))}} className={`calendar-cell ${sameMonth?"":"muted"} ${selected===day?"selected":""} ${todayLocal()===day?"today":""}`}><span className="calendar-number">{date.getDate()}</span><span className="calendar-markers">{dayE.slice(0,3).map(ev=><i key={ev.type+ev.id} className={`event-marker ${ev.type}`} />)}</span>{dayE.length>3&&<small>+{dayE.length-3}</small>}</button>})}</div><div className="calendar-legend"><span><i className="event-marker meeting"/> Reuniões</span><span><i className="event-marker task"/> Tarefas</span><span><i className="event-marker milestone"/> Marcos</span></div></Panel>
 <Panel className="day-detail"><p className="eyebrow">PROGRAMAÇÃO DO DIA</p><h2>{formatDate(selected,{weekday:"long",day:"numeric",month:"long"})}</h2><p className="subtext">{dayEvents.length} {dayEvents.length===1?"compromisso":"compromissos"} nesta data</p><div className="day-event-list">{dayEvents.map(ev=><Link href={ev.type==="meeting"?"/app/reunioes":ev.type==="task"?"/app/tarefas":"/app/roadmap"} className="day-event" key={ev.type+ev.id}><span className={`day-event-icon ${ev.type}`}>{ev.type==="meeting"?<CalendarDays size={18}/>:ev.type==="task"?<ListTodo size={18}/>:<Flag size={18}/>}</span><span><b>{ev.name}</b><small>{ev.meta}</small></span></Link>)}{!dayEvents.length&&<Empty title="Dia livre na agenda" description="Selecione outro dia ou agende uma reunião."/>}</div></Panel></div></>
}
