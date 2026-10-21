# Como executar e publicar o NEXO Verdant v2

## 1. Requisitos

- Node.js 22 LTS ou superior compatível com Next.js 16
- Conta Supabase com as tabelas e políticas já configuradas
- Conta Vercel para hospedagem

## 2. Instalação local

```bash
npm install
cp .env.example .env.local
```

No Windows PowerShell, use `Copy-Item .env.example .env.local`.

Defina **no seu computador** (nunca em um commit):

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_SUA_CHAVE_PUBLICA
```

Depois:

```bash
npm run dev
```

Abra http://localhost:3000.

## 3. Confirmação de e-mail por código

No Supabase, navegue para **Authentication → Email Templates → Confirm signup** e substitua o corpo pelo arquivo:

`supabase/templates/confirm-signup-code.html`

O marcador `{{ .Token }}` deve permanecer no modelo para que o Supabase envie o código de **seis dígitos**. Mantenha **Confirm email** ativado em Authentication → Providers → Email. Para enviar e-mails livremente em produção, configure SMTP e verifique limites de envio e entregabilidade.

## 4. Atualizar o GitHub

Repositório de referência: https://github.com/gustavolima150/AQUA_TECH_STARTUPS

No diretório clonado, extraia os arquivos deste ZIP, substitua os arquivos antigos, **não copie `.env.local`**, e então:

```bash
git add .
git commit -m "feat: redesign NEXO Verdant v2 and animated page transitions"
git push origin main
```

Se houver mudanças remotas novas, sincronize antes de aplicar alterações para evitar sobrescrever trabalho de outras pessoas.

## 5. Vercel

- Importe o repositório GitHub na Vercel ou conecte o projeto `aqua-tech-startups` existente.
- Framework: Next.js; diretório raiz: raiz do repositório.
- No painel Vercel → Settings → Environment Variables, configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Execute o deploy; assim que obtiver o domínio `*.vercel.app`, ajuste **Authentication → URL Configuration** no Supabase, incluindo localhost e o domínio de produção.
- Teste cadastro, confirmação de código, login, criação de workspace, tarefas, reuniões e navegação de ambos os temas.

## Notas

Este ZIP contém todo o código e os assets necessários, mas não inclui `node_modules` nem credenciais privadas. Dependências são instaladas com `npm install`.

A instalação completa e o build de produção não foram executados neste ambiente porque o registro npm ficou inacessível (`EAI_AGAIN`). A sintaxe de 35 arquivos TS/TSX foi validada pelo compilador TypeScript; CSS foi analisado por PostCSS. Faça um `npm run build` antes de liberar o domínio de produção.
