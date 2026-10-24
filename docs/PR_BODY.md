## Resumo

Entrega do Desafio Técnico PS 2026.2 (Missões 1–3 + diferenciais do tópico 4) na branch `entrega/thilon-m`.

- **Missão 1:** correções de validação, datas, senha/e-mail, UI responsiva e toasts 422
- **Missão 2:** Tarefas, pivot `membro_projeto`, trava de no máximo 2 projetos ativos, telas de equipe/tarefas
- **Missão 3:** README completo, prints em `docs/prints/`, OpenAPI/Swagger
- **Extras:** TypeScript rigoroso, Requests/Factory/Seeder de Tarefa, BrasilAPI validando datas de projeto (feriados), calendário de projetos na home

## Como validar

1. `backend`: `composer install` → `.env` → `php artisan migrate --seed` → `php artisan serve`
2. `frontend`: `pnpm install` → `.env.local` → `pnpm dev`
3. Login: `test@example.com` / `password`
4. Swagger: http://127.0.0.1:8000/docs/api
5. Trava: alocar membro já com 2 projetos ativos → **422** + toast
6. Feriado: criar projeto com início em `2026-12-25` → **422** (Natal)

## Uso de IA

Utilizei assistente de IA (Cursor) para acelerar scaffolding (migrations, controllers, telas), redação do README, OpenAPI/Swagger, integração BrasilAPI, prints e material de estudo.

**Limitações encontradas:** tipagem frouxa, sugestão de flags TypeScript depreciadas, esquecimento pontual de `revalidatePath` após mutações e mensagens de validação genéricas.

**Como garanti qualidade/segurança:** revisei a regra da trava em `AlocacaoMembroService`, Form Requests (authorize/rules/messages PT-BR), unique de tarefas, validação de feriados (backend + front), fluxo real no browser e documentei cada extra no README para o time avaliador verificar.
