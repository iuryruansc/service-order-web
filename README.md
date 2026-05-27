# Service Order Web

Frontend React + TypeScript + Vite para consumir a Service Order API.

Este projeto é uma SPA com autenticação, painel de dashboard, listagem de ordens, detalhe de ordem com histórico, cadastro de nova ordem e listagem de clientes.

## Tecnologias

- React 19
- TypeScript
- Vite
- React Router DOM v7
- ESLint

## Funcionalidades principais

- login com token JWT
- dashboard com métricas de ordens
- listagem e filtro por status
- página de detalhe da ordem com histórico de mudanças
- alteração do status da ordem
- cadastro de nova ordem
- listagem de clientes

## Estrutura de rotas

- `/login` — tela de autenticação
- `/dashboard` — painel principal
- `/orders` — lista de ordens
- `/orders/new` — criar nova ordem
- `/orders/:id` — detalhe da ordem
- `/clients` — lista de clientes

## Variáveis de ambiente

O frontend consome a API pelo `VITE_API_URL`.

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_API_URL=http://localhost:8000
```

Ajuste a URL para o endereço da sua API.

## Instalação

```bash
npm install
```

## Execução

```bash
npm run dev
```

Depois, abra o endereço exibido pelo Vite (por padrão `http://localhost:5173`).

## Build de produção

```bash
npm run build
```

Para testar o build localmente:

```bash
npm run preview
```

## Deploy

O projeto está preparado para deploy estático. Se subir no Vercel ou Netlify, certifique-se de definir também a variável de ambiente `VITE_API_URL` no ambiente de produção.

O arquivo `vercel.json` já contém um rewrite para servir a SPA corretamente.

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — compila o app para produção
- `npm run preview` — serve o build localmente
- `npm run lint` — executa o ESLint

## Observações

O frontend depende de uma API REST com endpoints de autenticação e ordens. Garanta que a API esteja acessível e permita CORS para o domínio onde o app estiver rodando.
