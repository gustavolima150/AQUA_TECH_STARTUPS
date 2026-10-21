# NEXO Startup OS — Histórico de atualizações

## Design Verdant v2 — 21/10/2026

- Nova identidade visual inspirada na referência enviada: musgo, verde-lima, preto profundo, brilho orgânico, superfícies de vidro e tipografia editorial.
- Nova página inicial completa com navegação, apresentação do produto, cartões ilustrados, demonstração visual, segurança e CTA.
- Fundo orgânico otimizado em WebP criado a partir das áreas fotográficas da referência fornecida; sem copiar textos, marca ou layout integral.
- Novo conjunto de estilos para painel, sidebar, navegação, listas, calendário, tarefas, reuniões, equipe, roadmap, modais e autenticação.
- Tema escuro como padrão, mantendo alternância para tema claro com escolha persistida no navegador.
- Transições de entrada ao navegar entre seções internas e nas telas de autenticação; animações ao rolar a página; respeita `prefers-reduced-motion`.
- Ícone SVG próprio da aplicação e tela de carregamento de áreas internas.
- Mantidos autenticação do Supabase com OTP, isolamento de espaços com RLS, tarefas, reuniões, calendário, equipe e metas.
- Template de e-mail para confirmação por código adicionado em `supabase/templates/confirm-signup-code.html` (deve ser configurado no painel do Supabase).

## Base v1.1 — 19/10/2026

- Políticas do Supabase corrigidas para permitir criar e ler os espaços recém-criados.
- Acesso a funções privilegiadas do banco restringido.
- Confirmação de e-mail por código de seis dígitos e opção de reenvio adicionadas ao fluxo de cadastro.
