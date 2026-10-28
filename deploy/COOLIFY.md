# Publicar o Nivo no Coolify

O frontend usa React e Vite. O Supabase continua como serviço externo.
Pré-requisitos: servidor com Coolify instalado, repositório Git acessível e
domínio apontado para o servidor.

## Configuração da aplicação

Crie uma aplicação a partir do repositório e escolha a branch.

| Campo | Valor |
| --- | --- |
| Build pack | Nixpacks |
| Base Directory | `/` se package.json estiver na raiz; `/nivo-app` se estiver nessa subpasta |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Site type | SPA (ou ative Is it a static site nas versões anteriores) |
| Publish Directory | `/dist` |
| Porta interna do Nginx | `80` |
| Node.js | 24 |

O projeto inclui `.node-version`. Se necessário, defina
`NIXPACKS_NODE_VERSION=24` nas variáveis de build do Coolify.
Não use `npm run dev` ou `npm run preview` como servidor de produção.

## Variáveis de ambiente

Cadastre no Coolify, com disponibilidade durante o **build**:

- `VITE_SUPABASE_URL`: URL do projeto Supabase.
- `VITE_SUPABASE_ANON_KEY`: chave pública anon do projeto.

As variáveis `VITE_*` são incorporadas ao JavaScript do navegador.
Nunca coloque chaves secretas ou `service_role` nessas variáveis.
Alterar os valores exige novo build/deploy.
O `.env` local não deve ir para o Git; `.env.example` contém somente exemplos.

## Rotas e domínio

Configure o domínio HTTPS no Coolify e faça o deploy.
O app usa BrowserRouter: abrir ou atualizar `/accounts` deve servir `index.html`.
Se o modo SPA não configurar isso, gere a configuração Nginx no Coolify e
substitua o bloco `location /` existente pelo trecho em `nginx-spa.conf` desta
pasta, preservando o restante da configuração. Salve e faça novo deploy;
somente reiniciar não aplica a configuração à imagem.
O `vercel.json` não configura o Coolify.

No Supabase, em Authentication > URL Configuration, ajuste a Site URL para o
domínio HTTPS e as Redirect URLs necessárias aos fluxos de autenticação.
Confira as políticas de Row Level Security: cada usuário deve acessar somente
seus próprios dados.

## Validação

Na pasta do app, usando Node.js 24:

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd run preview
```

Se ainda não existir `.env`, copie `.env.example` para `.env` e preencha os valores
antes do build. Preserve um `.env` existente.

Depois do deploy, confira página inicial, login/cadastro, logout, carregamento
dos dados e abertura direta/atualização de `/accounts` após autenticar.
Preferências e estados em localStorage não migram do localhost para o domínio.

Fontes: [Vite no Coolify](https://coolify.io/docs/applications/framework-examples/javascript/vite)
e [Nixpacks no Coolify](https://coolify.io/docs/applications/builds/nixpacks/deploy).
