import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, CalendarDays, Check, CheckCheck, CircleDot,
  Flag, Layers3, LockKeyhole, ShieldCheck, Sprout,
  Workflow, Zap, ListTodo, CalendarClock, TrendingUp, GitBranch, MoveUpRight
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollReveal } from "@/components/scroll-reveal";

const phases = [
  { index: "01", title: "Crie seu espaço", text: "Organize uma ou várias startups, mantendo os dados de cada equipe separados." },
  { index: "02", title: "Reúna seu time", text: "Convide os integrantes, atribua papéis e planeje a próxima reunião." },
  { index: "03", title: "Faça acontecer", text: "Acompanhe prioridades, prazos, metas e decisões até a entrega." },
];

export default function Home() {
  return <div className="verdant-site">
    <div className="site-atmosphere" aria-hidden="true" />
    <header className="v-header" id="inicio">
      <Link href="/" className="v-brand" aria-label="NEXO — página inicial"><span className="v-brand-icon"><Sprout size={19} strokeWidth={2.2} /></span><span>NEXO<span className="v-brand-period">.</span></span></Link>
      <nav aria-label="Menu principal" className="v-nav-links"><a href="#plataforma">Plataforma</a><a href="#como-funciona">Como funciona</a><a href="#seguranca">Segurança</a></nav>
      <div className="v-header-actions"><ThemeToggle /><Link href="/entrar" className="v-nav-login">Entrar</Link><Link href="/cadastro" className="v-button v-button-small">Começar <ArrowUpRight size={16}/></Link></div>
    </header>

    <main>
      <section className="v-hero v-container" aria-labelledby="v-hero-title">
        <div className="v-announcement"><span className="v-status-dot"/><span>UM NOVO JEITO DE CONSTRUIR</span><span className="v-announcement-arrow"><ArrowUpRight size={13}/></span></div>
        <h1 id="v-hero-title">Grandes ideias<br/><span className="v-hero-line">merecem <em>florescer.</em></span></h1>
        <p className="v-hero-description">Mais clareza para decidir. Mais sintonia para executar. Um espaço inteligente para transformar o potencial da sua startup em progresso real.</p>
        <div className="v-hero-cta"><Link href="/cadastro" className="v-button v-button-hero">Comece a construir <ArrowRight size={18}/></Link><a href="#plataforma" className="v-button-quiet">Conhecer a plataforma <ArrowUpRight size={17}/></a></div>
        <div className="v-hero-benefits"><span><Check size={13}/> Múltiplos espaços</span><span><Check size={13}/> Equipe alinhada</span><span><Check size={13}/> Acesso protegido</span></div>

        <ScrollReveal className="v-feature-grid" id="plataforma">
          <article className="v-feature v-feature-connections">
            <div className="v-feature-head"><span className="v-feature-icon"><Layers3 size={22}/></span><span className="v-feature-number">01 / CENTRALIZE</span></div>
            <h2>Tudo conectado.<br/>Nada perdido.</h2>
            <p>Reúna as informações importantes da sua startup em um único lugar.</p>
            <div className="v-connection-visual" aria-hidden="true"><div className="v-visual-items"><span><CalendarClock size={16}/></span><span><ListTodo size={16}/></span><span><Flag size={16}/></span></div><div className="v-connection-lines"><i/><i/><i/></div><span className="v-connection-hub"><Sprout size={28}/></span></div>
          </article>
          <article className="v-feature v-feature-progress">
            <div className="v-feature-head"><span className="v-feature-icon"><TrendingUp size={22}/></span><span className="v-feature-number">02 / EVOLUA</span></div>
            <h2>Enxergue o<br/>que realmente avança.</h2>
            <p>Metas, prazos e prioridades com visibilidade do primeiro dia à entrega.</p>
            <div className="v-chart" aria-hidden="true"><div className="v-chart-head"><span>Ritmo de execução</span><span><TrendingUp size={12}/> EM EVOLUÇÃO</span></div><svg viewBox="0 0 320 125" preserveAspectRatio="none" fill="none"><defs><linearGradient id="v-chart-area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#D5FC77" stopOpacity=".32"/><stop offset="1" stopColor="#D5FC77" stopOpacity="0"/></linearGradient></defs><path d="M0 114H320M0 78H320M0 40H320" stroke="#a7ca6b" strokeOpacity=".12" strokeDasharray="4 6"/><path d="M0 101 C25 106 35 65 59 71 S95 99 121 62 S155 87 182 52 S221 68 250 28 S290 50 320 10 L320 125 L0 125Z" fill="url(#v-chart-area)"/><path d="M0 101 C25 106 35 65 59 71 S95 99 121 62 S155 87 182 52 S221 68 250 28 S290 50 320 10" stroke="#D5FC77" strokeWidth="2.7" strokeLinecap="round"/><circle cx="250" cy="28" r="5.5" fill="#D5FC77"/><circle cx="250" cy="28" r="12" stroke="#D5FC77" strokeOpacity=".28"/></svg></div>
          </article>
          <article className="v-feature v-feature-secure">
            <div className="v-feature-head"><span className="v-feature-icon"><ShieldCheck size={22}/></span><span className="v-feature-number">03 / COLABORE</span></div>
            <h2>Cresçam juntos.<br/>Com confiança.</h2>
            <p>Permissões por função e cada pessoa sabendo o que precisa fazer.</p>
            <div className="v-orbit-visual" aria-hidden="true"><div className="v-orbit v-orbit-outer"/><div className="v-orbit v-orbit-mid"/><div className="v-orbit v-orbit-inner"/><span className="v-orbit-core"><ShieldCheck size={28}/></span><span className="v-orbit-point point-one"/><span className="v-orbit-point point-two"/><span className="v-orbit-point point-three"/></div>
          </article>
        </ScrollReveal>
      </section>

      <div className="v-values-band" aria-label="Valores da plataforma"><span>PROJETADO PARA EQUIPES QUE CONSTROEM</span><div><span><CircleDot size={15}/> CLAREZA</span><span><Workflow size={15}/> FLUXO</span><span><GitBranch size={15}/> CONEXÃO</span><span><Zap size={15}/> EVOLUÇÃO</span></div></div>

      <section className="v-product-section v-container">
        <ScrollReveal className="v-section-copy"><span className="v-kicker"><span/> SEU CENTRO DE COMANDO</span><h2>Menos ruído.<br/><em>Mais movimento.</em></h2><p>Deixe as conversas soltas e as planilhas fragmentadas para trás. Seu time visualiza as prioridades e conecta cada decisão ao que precisa acontecer.</p><ul><li><CheckCheck size={19}/> Visualize o andamento da sua startup</li><li><CheckCheck size={19}/> Organize reuniões e decisões em um só fluxo</li><li><CheckCheck size={19}/> Saiba quem faz o quê — e até quando</li></ul><Link className="v-inline-link" href="/cadastro">Explorar a experiência <ArrowUpRight size={18}/></Link></ScrollReveal>
        <ScrollReveal className="v-product-preview"><div className="v-product-title"><span><Sprout size={16}/> NEXO / VISÃO GERAL</span><span>PRÉVIA ILUSTRATIVA <CircleDot size={12}/></span></div><div className="v-product-surface"><div className="v-product-top"><div><span>ESPAÇO DE TRABALHO</span><h3>Próximos passos <span>✳</span></h3><p>Um lugar para o que faz seu negócio evoluir.</p></div><div className="v-preview-avatar">N</div></div><div className="v-product-metrics"><div><small>REUNIÕES</small><strong>04</strong><span>↗ próximas</span></div><div><small>TAREFAS</small><strong>12</strong><span>em andamento</span></div><div><small>PROGRESSO</small><strong>78%</strong><span>concluído</span></div></div><div className="v-product-task-list"><div><span className="v-mini-check checked"><Check size={12}/></span> Alinhar próximos passos <span className="v-tag">Concluído</span></div><div><span className="v-mini-check"/> Validar o primeiro protótipo <span className="v-tag">Esta semana</span></div><div><span className="v-mini-check"/> Planejar lançamento do MVP <span className="v-tag">Em breve</span></div></div></div></ScrollReveal>
      </section>

      <section className="v-steps-section" id="como-funciona"><div className="v-container"><ScrollReveal className="v-centered-heading"><span className="v-kicker"><span/> SIMPLES DE COMEÇAR</span><h2>Sua ideia tem potencial.<br/><em>Dê a ela um caminho.</em></h2><p>Três passos para criar um ambiente onde o trabalho acontece.</p></ScrollReveal><ScrollReveal className="v-steps-grid">{phases.map(({index,title,text})=><article className="v-step" key={index}><div className="v-step-number">{index}</div><h3>{title}</h3><p>{text}</p><MoveUpRight size={20}/></article>)}</ScrollReveal></div></section>

      <section className="v-security-section v-container" id="seguranca"><ScrollReveal className="v-security-card"><span className="v-security-icon"><LockKeyhole size={24}/></span><div><span className="v-kicker">A SEGURANÇA TAMBÉM CRESCE COM VOCÊ</span><h2>Cada time no seu espaço.<br/><em>Cada informação no lugar certo.</em></h2><p>Autenticação de usuários, e-mail verificado e regras de acesso por equipe com Supabase para você trabalhar com mais tranquilidade.</p></div><ShieldCheck className="v-security-watermark" size={160} strokeWidth={.8}/></ScrollReveal></section>

      <section className="v-final-cta v-container"><ScrollReveal className="v-final-card"><div className="v-final-glow"/><span className="v-kicker">O PRÓXIMO CAPÍTULO COMEÇA AQUI</span><h2>O futuro da sua startup<br/><em>não espera.</em></h2><p>Um espaço para sua equipe crescer com clareza.</p><Link href="/cadastro" className="v-button v-button-dark">Criar meu espaço <ArrowUpRight size={18}/></Link></ScrollReveal></section>
    </main>
    <footer className="v-footer v-container"><Link href="/" className="v-brand"><span className="v-brand-icon"><Sprout size={17}/></span><span>NEXO<span className="v-brand-period">.</span></span></Link><span>Ideias ganham direção. Times ganham impulso.</span><div><a href="#inicio">Voltar ao topo ↑</a><Link href="/entrar">Acessar plataforma <ArrowUpRight size={14}/></Link></div><small>© {new Date().getFullYear()} NEXO Startup OS</small></footer>
  </div>
}
