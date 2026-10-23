# Correções do frontend (Parte 1 (manutenção)) — guia para leigo

**PS Adapti 2026.2 · material de estudo**

Este PDF explica **tudo o que mudou no Next.js** na Parte 1 (manutenção) (manutenção visual e de hidratação). Números de linha batem com o código **atual**. Parte 2 (tarefas) (Tarefas) **não** entra aqui.

Pasta base: `ps-desafio-2026-2/frontend/`

---

## 0. Glossário rápido

| Palavra | Significado |
|---|---|
| **SSR** | O servidor Next gera HTML antes de mandar ao navegador. |
| **Hidratação** | O React no browser “liga” o HTML do servidor. Se o HTML do servidor ≠ o que o React calcula no client, aparece warning e a tela pode piscar. |
| **Server Component** | Componente sem `'use client'`; roda só no servidor (ex.: listagens). |
| **Client Component** | Tem `'use client'`; roda no browser (dialogs, sidebar, forms). |
| **422** | API recusou os dados (validação). O backend já devolve mensagem; o toast precisa **mostrar** essa mensagem. |
| **Timezone / UTC** | `new Date('2026-10-01')` vira meia-noite em UTC. No Brasil (UTC−3) vira **30/09**. Por isso não usamos `new Date` para date-only. |

### Fluxo da tela de projetos

```
page.tsx (Server)
  → ListProjects (Server) busca GET /projetos
      → formata datas com formatDateBr (sem new Date)
      → mobile: artigos empilhados | desktop: Table
      → Dialogs (Client) para CRUD + toastApiError nos 422
```

---

## 1. Mapa: problema → arquivo → linhas

| Bug | Arquivo | Linhas (hoje) |
|---|---|---|
| Data errada / hidratação | `src/services/formatter.ts` | **17–35**, export **37–42** |
| Listagem projetos mobile | `.../projetos/_components/list-project.tsx` | mobile **65–88**; desktop **91–119**; datas **83–84**, **109–110** |
| Listagem membros (mesmo padrão) | `.../membros/_components/list-member.tsx` | mobile + `formatDateBr` |
| Sidebar cobria a tela no celular | `.../admin/_components/admin-shell.tsx` | **10–62** |
| Layout admin | `.../admin/layout.tsx` | usa `AdminShell` |
| `Math.random` nos cards | `.../dashboard-summary-cards.tsx` | agora **8–27** sem random |
| Toast genérico | `src/services/toast-api-error.ts` | **12–30** |
| Dialogs projeto/membro | `dialog-create/update-*.tsx` | chamam `toastApiError` |
| E-mail vazio no edit | `form-fields-member.tsx` | **defaultValue={member?.email}** |
| Date input quebrado | forms projeto/membro | `toDateInputValue(...)` |

---

## 2. Helpers de data (`formatter.ts`)

**Arquivo:** `frontend/src/services/formatter.ts`

### `toDateInputValue` — linhas 17–27

Pega só `YYYY-MM-DD` de uma string ISO (`2026-10-01T00:00:00.000000Z` → `2026-10-01`) **sem** `new Date`. Serve para `<input type="date">`.

### `formatDateBr` — linhas 30–35

Converte `2026-10-01` → `01/10/2026` com `split('-')`. Sem fuso, sem hidratação estranha.

**Antes (bug):** `new Date(projeto.data_inicio).toLocaleDateString('pt-BR')`  
**Agora:** `formatDateBr(projeto.data_inicio)`

---

## 3. Listagem de projetos responsiva

**Arquivo:** `frontend/src/app/(dashboard)/admin/projetos/_components/list-project.tsx`

### Mobile — linhas 65–88 (`md:hidden`)

Em telas &lt; `md`, em vez da tabela larga, cada projeto vira um `<article>` com nome, cliente, datas e botões de ação.

### Desktop — linhas 91–119 (`hidden md:block`)

Tabela clássica, com datas via `formatDateBr` (linhas 109–110).

### Ações — componente `ProjetoActions` no topo do arquivo

Info / editar / excluir reutilizados no mobile e no desktop.

Membros seguem o **mesmo padrão** em `list-member.tsx` (pertinente: mesmo bug de data e mobile).

---

## 4. Sidebar hamburger (`admin-shell.tsx`)

**Arquivo:** `frontend/src/app/(dashboard)/admin/_components/admin-shell.tsx`

**Problema:** no mobile a sidebar era `h-screen w-full` **acima** do conteúdo — você rolava uma tela inteira de menu antes de ver a lista.

**Solução:**

| Linhas | O que faz |
|---|---|
| **11–12** | Estado `open` do menu |
| **14–16** | Fecha o menu ao trocar de rota |
| **18–23** | Trava scroll do body com menu aberto |
| **27–38** | Barra sticky com botão hamburger (só `md:hidden`) |
| **40–47** | Overlay escuro para fechar |
| **49–56** | Sidebar `fixed` que desliza (`-translate-x-full` ↔ `translate-x-0`) |
| **58–60** | Área do conteúdo |

`layout.tsx` agora só renderiza `<AdminShell>{children}</AdminShell>`.

No desktop (`md:`), grid de duas colunas como antes — menu sempre visível.

---

## 5. Cards da home sem `Math.random`

**Arquivo:** `frontend/src/app/(dashboard)/admin/_components/dashboard-summary-cards.tsx`

**Antes:** Client Component com `useState(() => count + Math.random())` → número no HTML do servidor ≠ número no browser → **hydration mismatch**.

**Agora:** Server Component simples (sem `'use client'`). Linhas **18** e **25** mostram `membersCount` e `projectsCount` diretos.

---

## 6. Toasts com erro 422 real

**Arquivo:** `frontend/src/services/toast-api-error.ts` (linhas **12–30**)

Lê `error.message` e junta `error.errors` (campos do Laravel) na `description`.

Usado em:

- `dialog-create-project.tsx` / `dialog-update-project.tsx` / `dialog-delete-project.tsx`
- `dialog-create-member.tsx` / `dialog-update-member.tsx` / `dialog-delete-member.tsx`

Ex.: criar projeto com fim antes do início → toast com *“A data de término deve ser igual ou posterior…”* (mensagem do backend), não só “Não foi possível criar”.

---

## 7. Forms

### Projeto — `form-fields-project.tsx`

`defaultValue={toDateInputValue(projeto?.data_inicio)}` e o mesmo para `data_fim` — input date só aceita `YYYY-MM-DD`.

### Membro — `form-fields-member.tsx`

- **E-mail:** `defaultValue={member?.email}` (antes ficava vazio no edit).
- **Aniversário:** `toDateInputValue`.
- **Senha no edit:** placeholder “Deixe em branco para manter”; `required={!member}`.
- Cor/aniversário sem `required` forçado (alinha ao backend nullable).

---

## 8. Como testar

1. `pnpm dev` no frontend; backend `php artisan serve`.
2. DevTools → modo celular: hamburger abre o menu; lista de projetos em blocos, não tabela esmagada.
3. Console: sem warning de hydration nos cards da home.
4. Criar projeto com datas invertidas → toast com texto do Laravel.
5. Editar membro → e-mail já preenchido.

---

## 9. Frases para apresentação

- “Datas date-only não passam por `new Date`; `formatDateBr` só faz split — evita dia errado por UTC e mismatch SSR.”
- “No mobile trocamos tabela por lista empilhada (`md:hidden` / `hidden md:block`).”
- “Sidebar off-canvas com hamburger; no desktop o grid de sempre.”
- “`Math.random` nos cards gerava hydration mismatch; removemos.”
- “Toast agora repassa o 422 do backend — a validação já existia na API.”

---

## 10. O que NÃO está neste PDF

Parte 2 (tarefas) (Tarefas, pivot, trava de 2 projetos ativos) — PDF separado depois.
