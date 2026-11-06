# FIGHT FLOW — Conhecimento. Comunidade. Evolução.

Plataforma **demonstrativa** sobre lutas e artes marciais: comunidade, cursos, análises técnicas, eventos, gamificação e apoio simulado. Todos os dados são fictícios e ficam salvos apenas no navegador (localStorage). Nenhuma transação financeira é realizada.

## Executar localmente

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera /dist
npm run preview   # serve o build
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie este projeto para a branch `main`:
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/fight-flow.git
   git push -u origin main
   ```
2. No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. O workflow `.github/workflows/deploy.yml` faz o build e publica a cada push na `main`.
4. O site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

Funciona com qualquer nome de repositório: o Vite usa `base: './'` e as rotas usam `HashRouter` (`/#/comunidade`), então não há erro 404 ao atualizar a página.

## Contas de demonstração

Na tela inicial:
- **Entrar com a conta demonstrativa** → usuário "Lutador Demo" (já com algum progresso).
- **Entrar como administrador (demo)** → libera o **Painel Admin** (menu lateral ou menu do avatar).
- **Criar cadastro local** → apenas apelido, avatar, modalidades, nível e objetivo.

## Temas

Botão de sol/lua no cabeçalho (ou em Configurações): **Dark Fight** (preto + roxo) e **Light Fight** (branco + laranja). A preferência persiste após recarregar.

## Restaurar dados

Configurações → **Restaurar dados da demonstração**.

## Estrutura

```
src/
  components/  UI reutilizável (cards, modal, toasts, player simulado, diagramas, capas SVG)
  data/        dados fictícios (modalidades, cursos/aulas, especialistas, perfis, posts, análises, eventos, gamificação)
  hooks/       helpers de conteúdo, gráficos e loading
  layouts/     AppLayout (sidebar, header, navegação mobile)
  pages/       uma página por rota
  store/       Zustand + persistência local; toasts
  styles/      Tailwind + variáveis dos temas
  types/       tipos TypeScript
  utils/       formatação e utilidades
```

Stack: React 18, TypeScript, Vite, Tailwind CSS, React Router (HashRouter), Zustand, Lucide React, Recharts.
