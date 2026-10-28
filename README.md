# Nivo

Aplicativo de finanças com React, Vite e Supabase.
Consulte o [guia de publicação no Coolify](deploy/COOLIFY.md) para configurar o
build, as variáveis de ambiente e as rotas em produção.

## Rodar localmente no Windows

Na pasta deste arquivo, com Node.js 24 e o `.env` configurado:

```powershell
npm.cmd ci
npm.cmd run dev
```

Se ainda não existir `.env`, copie `.env.example` e preencha os valores do
Supabase. Preserve o arquivo se ele já existir.

## Documentação original do template

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
