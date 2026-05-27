# Guia — Frontend React + Vite + TypeScript

Roteiro **passo a passo** para criar um painel web consumindo a **Service Order API** (FastAPI). Pensado para quem **nunca usou** React, Vite ou TypeScript.

**Objetivos:** aprender front moderno com base prática + complementar o portfólio (full stack leve).

**API de referência:**

- Produção: `https://serviceorder-production.up.railway.app`
- Swagger: `/docs`
- Coleção Postman: `docs/service_order_api.postman_collection.json`

---

## Como usar este guia

1. Siga as fases **em ordem** — cada uma constrói sobre a anterior.
2. Marque o checklist ao final de cada fase.
3. Só avance quando o critério **“Pronto quando”** estiver ok.
4. Erros fazem parte do estudo; anote em um arquivo `frontend-notes.md` se quiser.

**Repositório sugerido:** projeto separado, ex.: `service-order-web` (deixa o repo da API focado no back).

---

## Mapa das fases

| Fase | Tema                         | Tempo estimado |
| ---- | ---------------------------- | -------------- |
| 0    | Ambiente e conceitos         | 0,5–1 dia      |
| 1    | Criar projeto Vite           | 0,5 dia        |
| 2    | TypeScript e componentes     | 1 dia          |
| 3    | Chamar a API (health) + CORS | 0,5–1 dia      |
| 4    | Login e autenticação         | 1–2 dias       |
| 5    | Rotas e layout               | 1 dia          |
| 6    | Listagem de ordens           | 1–2 dias       |
| 7    | Detalhe e mudança de status  | 1–2 dias       |
| 8    | Clientes                     | 1 dia          |
| 9    | Dashboard (opcional)         | 0,5–1 dia      |
| 10   | Refino e deploy do front     | 1 dia          |

**Total aproximado:** 2–3 semanas estudando algumas horas por dia.

---

## Glossário rápido (consulte quando aparecer)

| Termo          | Significado simples                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| **React**      | Biblioteca para montar interface em **componentes** (pedaços de tela reutilizáveis).                  |
| **Vite**       | Ferramenta que **empacota** o projeto e sobe servidor de desenvolvimento rápido (`npm run dev`).      |
| **TypeScript** | JavaScript com **tipos** — ajuda a evitar erros (parecido com validação do Pydantic).                 |
| **Componente** | Função que retorna o que aparece na tela (HTML via JSX).                                              |
| **JSX**        | Sintaxe que parece HTML dentro do JavaScript/TypeScript.                                              |
| **Props**      | Dados que o componente **pai** passa para o **filho** (somente leitura).                              |
| **State**      | Dados que **mudam** na tela (ex.: texto do input, lista carregada).                                   |
| **Hook**       | Funções do React que começam com `use` (`useState`, `useEffect`, …).                                  |
| **SPA**        | Single Page Application — uma página HTML; o React troca o conteúdo sem recarregar tudo.              |
| **CORS**       | Regra do navegador: front em `localhost:5173` só fala com API em outra origem se o **back permitir**. |

---

## Fase 0 — Preparação

### O que você aprende

- Diferença entre **back** (sua API) e **front** (navegador).
- Ferramentas que vai instalar.

### Passos

1. Instale **Node.js LTS** (versão 20 ou 22): https://nodejs.org
   - Confirme no terminal: `node -v` e `npm -v`
2. Editor: VS Code / Cursor com extensões opcionais: **ESLint**, **ES7+ React Snippets**.
3. Leia em 10 minutos (sem decorar):
   - [React — Quick Start](https://react.dev/learn)
   - Primeira seção “Creating a UI” apenas.

### Pronto quando

- [x] `node -v` e `npm -v` funcionam no terminal
- [x] Você sabe explicar: “API roda no Railway; front rodará no meu PC e depois na Vercel/Netlify”

---

## Fase 1 — Criar o projeto Vite

### O que você aprende

- Estrutura mínima de um app React moderno.
- Scripts `dev`, `build`, `preview`.

### Passos

1. Crie a pasta do front (fora ou ao lado do repo da API):

```powershell
cd D:\Python
npm create vite@latest service-order-web -- --template react-ts
cd service-order-web
npm install
npm run dev
```

2. Abra o link que aparecer (geralmente `http://localhost:5173`).
3. Explore os arquivos:

| Arquivo          | Função                                 |
| ---------------- | -------------------------------------- |
| `index.html`     | Página única onde o React “gruda”      |
| `src/main.tsx`   | Entrada do app                         |
| `src/App.tsx`    | Componente raiz (comece editando aqui) |
| `vite.config.ts` | Configuração do Vite                   |
| `tsconfig.json`  | Regras do TypeScript                   |

4. Altere o texto em `App.tsx`, salve e veja a tela atualizar (**hot reload**).

### Pronto quando

- [x] `npm run dev` abre a página padrão do Vite
- [x] Você mudou um texto em `App.tsx` e viu a alteração no navegador

---

## Fase 2 — TypeScript e componentes

### O que você aprende

- Tipos básicos, `interface`, componentes filhos, `useState`.

### Passos

1. Crie `src/components/Hello.tsx`:

```tsx
type HelloProps = {
  name: string;
};

export function Hello({ name }: HelloProps) {
  return <p>Ola, {name}</p>;
}
```

2. Use em `App.tsx`:

```tsx
import { Hello } from "./components/Hello";

export default function App() {
  return (
    <main>
      <Hello name="Service Order" />
    </main>
  );
}
```

3. Adicione um contador (exemplo oficial do React):

```tsx
import { useState } from "react";

// dentro do componente:
const [count, setCount] = useState(0);
// <button onClick={() => setCount(count + 1)}>{count}</button>
```

4. Exercício: componente `StatusBadge` que recebe `status: string` e mostra um `<span>` com cor diferente para `open`, `done`, etc.

### Conceitos TS para este projeto

```ts
// Resposta genérica da API
type TokenResponse = {
  access_token: string;
  token_type: string;
};

type ServiceOrder = {
  id: number;
  title: string;
  status: string;
  priority: string;
  client_id: number;
  responsible_user_id: number;
};
```

Você vai expandir esses tipos conforme usar o Swagger (`/docs` → schemas).

### Pronto quando

- [x] Existe pasta `src/components/` com pelo menos 2 componentes
- [x] Você usou `useState` em algum lugar
- [x] Entende a diferença entre **props** (entrada) e **state** (muda com o tempo)

---

## Fase 3 — Primeira chamada à API + CORS

### O que você aprende

- `fetch`, variáveis de ambiente no Vite, erro de CORS e como corrigir no FastAPI.

### Passos — Front

1. Crie `.env` na raiz do projeto front (não commite segredos; use `.env.example`):

```env
VITE_API_URL=http://127.0.0.1:8000
```

Para testar contra produção:

```env
VITE_API_URL=https://serviceorder-production.up.railway.app
```

2. Crie `src/services/api.ts`:

```ts
const baseUrl = import.meta.env.VITE_API_URL;

export async function getHealth() {
  const response = await fetch(`${baseUrl}/`);
  if (!response.ok) {
    throw new Error("Falha no health check");
  }
  return response.json();
}
```

3. Em `App.tsx`, chame no `useEffect` e mostre o JSON na tela (loading + erro simples).

> No Vite, só variáveis que começam com `VITE_` ficam visíveis no front.

### Passos — Back (CORS)

Enquanto o front estiver em `localhost:5173`, o navegador **bloqueará** chamadas à API sem CORS.

No `app/main.py` da API, adicione (ajuste quando tiver URL do front em produção):

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        # "https://seu-app.vercel.app",  # depois do deploy
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Faça deploy ou rode a API local com `uvicorn` / `docker compose`.

### Pronto quando

- [x] A tela mostra a resposta do `GET /` da API
- [x] Você viu erro de CORS pelo menos uma vez e corrigiu com o middleware
- [x] Entende: Postman não usa CORS; **navegador sim**

---

## Fase 4 — Login e token JWT

### O que você aprende

- `POST /auth/login` com `application/x-www-form-urlencoded`
- Guardar token e enviar `Authorization: Bearer ...`

### Passos

1. Crie `src/services/auth.ts`:

```ts
const baseUrl = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
  const body = new URLSearchParams();
  body.append("username", email); // OAuth2 usa "username" = e-mail
  body.append("password", password);

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error("Credenciais invalidas");
  }

  return response.json() as Promise<{
    access_token: string;
    token_type: string;
  }>;
}
```

2. Crie `src/context/AuthContext.tsx` (ou hook simples no início):
   - state: `token | null`
   - funções: `login`, `logout`
   - persistir token em `localStorage` (ok para **estudo**; em apps reais avalie alternativas mais seguras depois)

3. Página `LoginPage` com formulário (e-mail + senha).

4. Função auxiliar para requests autenticadas:

```ts
export function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}
```

5. Teste `GET /auth/me` após login e mostre nome do usuário.

**Dados de teste:** `admin@example.com` / `123456` (se rodou `seed.py`) ou crie usuário via `POST /users/`.

### Pronto quando

- [x] Login funciona contra API local ou Railway
- [x] Após refresh da página, token ainda loga (se escolheu localStorage)
- [x] `GET /auth/me` retorna dados do usuário na tela
- [x] Logout limpa token e volta para login

---

## Fase 5 — Rotas e layout

### O que você aprende

- **React Router** — várias “páginas” na SPA.
- Layout com menu e área de conteúdo.

### Passos

1. Instale:

```powershell
npm install react-router-dom
```

2. Estrutura sugerida:

```text
src/
  pages/
    LoginPage.tsx
    OrdersPage.tsx
    OrderDetailPage.tsx
    ClientsPage.tsx
    DashboardPage.tsx   (opcional, fase 9)
  components/
    Layout.tsx
    Navbar.tsx
    PrivateRoute.tsx
  context/
    AuthContext.tsx
  services/
    api.ts
    auth.ts
    orders.ts
    clients.ts
  types/
    index.ts
  App.tsx
  main.tsx
```

3. Rotas em `App.tsx`:
   - `/login` — público
   - `/` ou `/orders` — lista (protegida)
   - `/orders/:id` — detalhe (protegida)
   - `/clients` — clientes (protegida)

4. `PrivateRoute`: se não houver token, redireciona para `/login`.

5. `Layout`: barra com links + botão Sair.

### Pronto quando

- [x] Navegação entre telas sem recarregar a página inteira
- [x] Rota protegida redireciona para login se não autenticado
- [x] Layout aparece em todas as páginas internas

---

## Fase 6 — Listagem de ordens

### O que você aprende

- Listas em React, query params, loading/erro vazio.
- (Introdução opcional) **TanStack Query** — quando quiser menos código de loading manual.

### Passos

1. `src/services/orders.ts` — `listOrders(token, filters?)` → `GET /service-orders/`

2. Página `OrdersPage`:
   - tabela ou cards: título, status, prioridade, cliente
   - filtro por `status` (select)
   - estado: carregando / erro / lista vazia

3. Tipos em `src/types/index.ts` alinhados ao JSON do Swagger.

### Sem TanStack Query (primeiro)

Use `useEffect` + `useState` para buscar ao montar a página e quando o filtro mudar.

### Com TanStack Query (quando se sentir confortável)

```powershell
npm install @tanstack/react-query
```

Envolva o app em `QueryClientProvider` e use `useQuery` para `listOrders`.

### Pronto quando

- [x] Lista de ordens aparece autenticado
- [x] Filtro por status altera a lista
- [x] Mensagem amigável quando não há ordens

---

## Fase 7 — Detalhe e mudança de status

### O que você aprende

- Parâmetro de rota `:id`, `PATCH`, formulário controlado.

### Passos

1. `getOrder(id)` → `GET /service-orders/{id}`
2. `updateOrderStatus(id, status, note)` → `PATCH /service-orders/{id}/status`
3. `getOrderHistory(id)` → `GET /service-orders/{id}/history`

4. `OrderDetailPage`:
   - dados da ordem
   - select com status permitidos (`open`, `in_progress`, …)
   - campo “nota” opcional
   - timeline/lista do histórico abaixo

5. Trate erro **400** (regra de negócio) e mostre `detail` da API na tela.

### Pronto quando

- [x] Clique em uma ordem na lista abre o detalhe
- [x] Mudança de status funciona e histórico atualiza
- [x] Erro de transição inválida aparece para o usuário

---

## Fase 8 — Clientes

### O que você aprende

- Formulário de criação + listagem simples.

### Passos

1. `ClientsPage`: listar `GET /clients/`
2. Formulário `POST /clients/` (nome, e-mail, telefone)
3. Validação mínima no front (campos obrigatórios) — validação forte continua na API.

### Pronto quando

- [x] Criar e listar clientes sem sair do app
- [x] Usar `client_id` ao criar ordem (select de clientes no formulário de nova ordem — **extra**)

---

## Fase 9 — Dashboard (opcional)

### Passos

1. `GET /dashboard/` — exibir números em cards (total abertas, por status, etc., conforme retorno da API).
2. Só implemente depois das fases 6–8 estarem estáveis.

### Pronto quando

- [x] Dashboard renderiza métricas reais da API

---

## Fase 10 — Refino e deploy

### O que você aprende

- Build de produção, variáveis de ambiente, hospedagem estática.

### Passos

1. `npm run build` — gera pasta `dist/`
2. `npm run preview` — testa build localmente
3. Deploy em **Vercel** ou **Netlify**:
   - conecte o repo `service-order-web`
   - variável `VITE_API_URL` = URL do Railway
4. Adicione a URL do front em `allow_origins` do CORS na API
5. Atualize README do front com screenshot + link

### Checklist de qualidade

- [x] Loading em todas as telas que chamam API
- [x] Mensagens de erro legíveis (não só `console.log`)
- [ ] Responsivo básico (CSS simples ou Tailwind)
- [x] README do front: como rodar, env, link da API

### Pronto quando

- [x] App acessível por HTTPS público
- [x] Login e fluxo principal funcionam contra API em produção

---

## O que deixar para depois (não bloqueie o estudo)

| Recurso da API           | Quando estudar                                         |
| ------------------------ | ------------------------------------------------------ |
| Anexos (upload)          | Depois de dominar formulários e `fetch` com `FormData` |
| Export PDF/Excel         | Botão que abre URL com token ou download via blob      |
| Gestão de usuários admin | Quando entender roles no contexto                      |
| E-mail                   | Só no back; front não precisa                          |

---

## Erros comuns (e o que fazer)

| Sintoma                  | Causa provável                     | Solução                               |
| ------------------------ | ---------------------------------- | ------------------------------------- |
| CORS no console          | API sem middleware / origem errada | Ajustar `CORSMiddleware`              |
| 401 em tudo              | Token ausente ou expirado          | Login de novo; conferir header Bearer |
| 422 Unprocessable        | JSON com campo errado              | Comparar body com Swagger             |
| Tela branca              | Erro de JS/TS                      | Abrir console (F12); ler stack trace  |
| `VITE_API_URL` undefined | `.env` sem prefixo `VITE_`         | Renomear e reiniciar `npm run dev`    |

---

## Materiais de estudo (ordem sugerida)

1. [React.dev — Learn](https://react.dev/learn) (oficial, gratuito)
2. [TypeScript Handbook — The Basics](https://www.typescriptlang.org/docs/handbook/intro.html)
3. [Vite Guide](https://vite.dev/guide/)
4. [React Router — Tutorial](https://reactrouter.com/en/main/start/tutorial)
5. [TanStack Query — Overview](https://tanstack.com/query/latest/docs/framework/react/overview) (após fase 6)

---

## Registro de progresso

| Fase | Concluída em | Notas |
| ---- | ------------ | ----- |
| 0    |              |       |
| 1    |              |       |
| 2    |              |       |
| 3    |              |       |
| 4    |              |       |
| 5    |              |       |
| 6    |              |       |
| 7    |              |       |
| 8    |              |       |
| 9    |              |       |
| 10   |              |       |

---

## Relação com outros guias do repo

| Arquivo                                          | Uso                                       |
| ------------------------------------------------ | ----------------------------------------- |
| `guia_fluxo_portfolio.md`                        | Back + deploy + CI (já concluído)         |
| `guia_projeto_ordem_servico_fastapi.md`          | Regras de negócio da API                  |
| `guia_frontend_react_vite.md`                    | **Este arquivo** — front do zero          |
| `docs/service_order_api.postman_collection.json` | Testar API antes de implementar cada tela |

---

## Regra de ouro

> Implemente **uma fase por vez**. Se travar, teste o mesmo endpoint no Swagger ou Postman — se funcionar lá, o problema é front (URL, token, CORS ou formato do body).

Quando terminar a **Fase 4**, você já terá um mini app autenticado. Isso já conta como grande avanço para quem nunca usou React.
