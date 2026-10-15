# NEXO — Startup Operating System

Aplicação web (Next.js + React + TypeScript + Supabase) para organizar uma ou mais startups, com design responsivo e pronta para publicação na Vercel.

## Funcionalidades

- **Login, cadastro, e-mail confirmado e recuperação de senha** usando Supabase Auth (não armazena senhas no código ou nas tabelas da aplicação).
- **Múltiplas startups** isoladas. Um membro só enxerga dados dos espaços aos quais pertence.
- **Dashboard** com reuniões futuras, tarefas, progresso médio e visão da equipe.
- **Calendário mensal** com eventos de três tipos: reuniões, prazos de tarefas e marcos estratégicos.
- **Reuniões** com data/hora, local ou link, descrição, mudança de status e assuntos da pauta.
- **Roteiro estratégico com 9 assuntos**, inserível com um botão em uma reunião sem pauta.
- **Ata de decisões**: marque os assuntos discutidos e registre decisões por tópico.
- **Tarefas estilo Kanban**: status, responsável, prioridade, prazo, edição e exclusão.
- **Equipe**: cargo/função no projeto (ex.: CTO, marketing, financeiro), permissão de acesso, convites com prazo e revogação.
- **Roadmap**: metas/marcos, datas, percentuais de conclusão.
- **Perfil da conta e configurações da startup**.
- **Interface mobile/desktop** com navegação responsiva.

## Permissões

| Permissão | Pode ler | Pode criar/editar reuniões, tarefas e marcos | Gerencia equipe e startup |
|---|---|---|---|
| Proprietário | Sim | Sim | Sim |
| Administrador | Sim | Sim | Sim |
| Gestor | Sim | Sim | Não |
| Membro | Sim | Sim | Não |
| Visualização | Sim | Não | Não |

**Atenção:** "função na startup" (CEO, CTO, designer etc.) e "permissão no sistema" são campos separados. Administradores atribuem ambos. Convites são gerados como links compartilháveis; **o sistema não envia o convite automaticamente por e-mail**. A confirmação do e-mail de cadastro, porém, é enviada pelo Supabase Auth.

## Instalação — 1. Supabase

1. Crie um projeto em https://supabase.com/.
2. Vá em **SQL Editor**, copie todo o conteúdo de `supabase/schema.sql` e execute no projeto novo **uma única vez**. Ele cria tabelas, gatilhos, índices, funções e **Row Level Security (RLS)**.
3. Em **Authentication → Providers → Email**, **habilite a confirmação de e-mail** (`Confirm email`). Não desative essa exigência.
4. Em **Authentication → URL Configuration**, ajuste **Site URL** e **Redirect URLs** para seu domínio final (`https://SEU-SITE.vercel.app`) e sua origem local (`http://localhost:3000`). Se usar ambientes de preview da Vercel, adicione somente os domínios de preview necessários.
5. Em **Authentication → Email Templates → Confirm signup**, use um link compatível com a sessão por cookies (SSR), por exemplo:

```html
<a href="{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirmar meu e-mail</a>
```

6. Em **Authentication → Email Templates → Reset password**, defina um link equivalente:

```html
<a href="{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">Redefinir minha senha</a>
```

7. Para **enviar e-mails para outras pessoas em produção**, configure um **servidor SMTP** em Authentication → SMTP Settings. O serviço de envio padrão do Supabase tem limites/restrições. Teste confirmação e recuperação de senha com contas reais antes de divulgar o site.
8. Em **Project Settings → API Keys**, obtenha a **Project URL** e a **publishable key**, que começa em `sb_publishable_` (ou a chave pública `anon` se seu projeto ainda usar o modelo antigo). **Nunca utilize `service_role` no frontend.**

> As rotas de confirmação só funcionarão corretamente quando os templates de e-mail e URLs de redirecionamento estiverem configurados. O banco de dados deve ser instalado antes do primeiro cadastro/uso.

## Instalação — 2. Projeto local

Requisitos: Node.js 20.9+ (recomenda-se Node.js 22) e npm.

```bash
npm install
cp .env.example .env.local
```

Se estiver no Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Edite o `.env.local` com suas credenciais reais:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_SUA_CHAVE
```

Depois rode:

```bash
npm run dev
```

Abra **http://localhost:3000**.

**Sobre `.env`:** há um `.env` de exemplo com valores fictícios e o arquivo `.env.example`. O arquivo que você deve preencher localmente é `.env.local`. `.env` e `.env.local` estão no `.gitignore`; **nunca envie credenciais reais para o Git**.

## Publicação — 3. Vercel

1. Suba o projeto em um repositório Git privado ou público, sem arquivos `.env` reais.
2. Acesse https://vercel.com/new e importe o repositório.
3. Framework: **Next.js**. Build command: `npm run build` (padrão). Diretório raiz: raiz do repositório.
4. Em **Project → Settings → Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
5. Selecione os ambientes em que a aplicação será usada (ao menos **Production**); faça novo deploy após qualquer alteração nas variáveis.
6. Publique. Copie o domínio `https://...vercel.app` e atualize **Supabase → Authentication → URL Configuration**; confira os templates de confirmação.
7. Faça o teste completo de cadastro → confirmação por e-mail → login → criação da startup → convite.

Não é necessário um backend próprio na Vercel: o Next.js executa as rotas de autenticação e o Supabase hospeda o banco e a autenticação.

## Testes recomendados antes de produção

1. Cadastro com e-mail válido exige confirmação; login sem confirmar deve falhar.
2. Recuperação de senha funciona e não expõe se o e-mail está cadastrado.
3. Convite para `email-a@...` não pode ser aceito pela conta `email-b@...`.
4. Convites expirados e revogados são recusados.
5. Usuário em uma startup não consegue consultar/alterar dados de outra startup (teste com duas contas e duas equipes diferentes).
6. Membro no modo Visualização não pode criar/editar itens (mesmo via requisição direta).
7. Apenas administrador/proprietário consegue alterar as permissões e funções dos membros.
8. Calendário, tarefas e roadmap exibem os mesmos prazos, respeitando o fuso do navegador.
9. Teste a responsividade no celular e a acessibilidade por teclado.
10. Antes de operação comercial, faça auditoria adicional de segurança, backup, monitoramento de logs e política de privacidade/LGPD.

## Estrutura

```text
app/                     Rotas Next.js, landing page e autenticação
components/              Interface, calendário, dashboard e áreas administrativas
lib/                     Tipos e clientes Supabase
supabase/schema.sql      Estrutura SQL e políticas RLS
proxy.ts                 Atualização de sessão autenticada
.env.example             Modelo de configuração pública
.env                     Placeholders locais (ignorado pelo Git)
```

## Roteiro de reunião sugerido

Em **Reuniões e pautas**, crie uma reunião. Dentro dela, clique em **Inserir roteiro estratégico com 9 pontos**. O roteiro contempla:

1. Visão e objetivo da startup.
2. Problema e público-alvo.
3. MVP e protótipo.
4. Equipe e divisão de responsabilidades.
5. Orçamento e recursos.
6. Divulgação e aquisição de clientes.
7. Riscos e obstáculos.
8. Metas e cronograma.
9. Decisões, tarefas e próximo encontro.

Defina datas reais no calendário e converta cada decisão importante em uma tarefa com responsável.

## Limitações conscientes desta primeira versão

- Convites são compartilhados por link, **sem envio automático de e-mail**. O e-mail de confirmação e recuperação é real quando o Supabase/SMTP estiver configurado.
- Não há integração automática com Google Calendar/Meet, notificações push, anexos ou chat; são possíveis extensões futuras.
- Não há cobrança, controle financeiro ou auditoria imutável de alterações.
- As consultas são limitadas (p. ex. 500 reuniões e 1000 tarefas por startup nesta UI). Para crescer, implementar paginação e índices adicionais.
- Segurança em produção depende também da configuração do Supabase, SMTP, Vercel, proteção de contas administrativas e auditoria contínua. Não confundir esse MVP com uma plataforma previamente auditada.

## Licença

Código de exemplo entregue para adaptação e uso próprio. Personalize a marca, revise os fluxos e configure suas políticas organizacionais antes de publicá-lo amplamente.
