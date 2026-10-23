/**
 * Gera imagens estilo IDE dos trechos de código + PDF didático.
 * Uso: node docs/generate-projetos-membro-pdf.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const assets = join(__dirname, 'assets', 'projetos-membro')
mkdirSync(assets, { recursive: true })

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function codeToSvg(filename, code, startLine = 1) {
  const lines = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  const lineH = 18
  const padX = 16
  const padY = 48
  const gutterW = 44
  const charW = 7.8
  const maxLen = Math.max(...lines.map((l) => l.length), 40)
  const width = Math.min(920, Math.max(560, gutterW + padX * 2 + maxLen * charW))
  const height = padY + lines.length * lineH + 20

  const rows = lines
    .map((line, i) => {
      const n = startLine + i
      const y = padY + i * lineH
      return `
      <text x="${padX + 8}" y="${y}" class="ln">${n}</text>
      <text x="${gutterW + padX}" y="${y}" class="code">${esc(line) || ' '}</text>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      .bg { fill: #1e1e2e; }
      .bar { fill: #181825; }
      .dot-r { fill: #f38ba8; }
      .dot-y { fill: #f9e2af; }
      .dot-g { fill: #a6e3a1; }
      .title { fill: #cdd6f4; font: 600 12px Consolas, 'Courier New', monospace; }
      .ln { fill: #6c7086; font: 12px Consolas, 'Courier New', monospace; text-anchor: end; }
      .code { fill: #cdd6f4; font: 12px Consolas, 'Courier New', monospace; white-space: pre; }
      .gutter { fill: #11111b; }
    </style>
  </defs>
  <rect class="bg" width="100%" height="100%" rx="10" ry="10"/>
  <rect class="bar" width="100%" height="34" rx="10" ry="10"/>
  <rect class="bar" y="20" width="100%" height="14"/>
  <circle class="dot-r" cx="18" cy="17" r="5"/>
  <circle class="dot-y" cx="36" cy="17" r="5"/>
  <circle class="dot-g" cx="54" cy="17" r="5"/>
  <text class="title" x="74" y="21">${esc(filename)}</text>
  <rect class="gutter" x="0" y="34" width="${gutterW}" height="${height - 34}"/>
  ${rows}
</svg>`
}

const snippets = [
  {
    id: '01-model-projetos',
    file: 'backend/app/Models/Membro.php',
    start: 36,
    title: 'Relação N:N já existente no model',
    explain:
      'O Eloquent já sabia que um membro tem muitos projetos via tabela pivot `membro_projeto`. Sem isso, o `with(\'projetos\')` do controller não funcionaria.',
    code: `public function projetos(): BelongsToMany
{
    return $this->belongsToMany(Projeto::class, 'membro_projeto')
        ->withTimestamps();
}`,
  },
  {
    id: '02-controller-index',
    file: 'backend/app/Http/Controllers/MembroController.php',
    start: 24,
    title: 'API lista membros JÁ COM os projetos',
    explain:
      '`with([\'projetos\' => ...])` é eager loading: em uma consulta só, o Laravel traz os projetos de cada membro (evita N+1). Ordenamos por nome para a tela ficar previsível.',
    code: `public function index(): JsonResponse
{
    $membros = $this->membro->newQuery()
        ->with(['projetos' => fn ($q) => $q->orderBy('nome')])
        ->orderBy('nome')
        ->get();

    return response()->json($membros, Response::HTTP_OK);
}`,
  },
  {
    id: '03-controller-show',
    file: 'backend/app/Http/Controllers/MembroController.php',
    start: 54,
    title: 'API de um membro também carrega projetos',
    explain:
      'O `show` (GET /membros/{id}) usa a mesma ideia: se alguém buscar um membro isolado, os projetos já vêm no JSON.',
    code: `public function show(String $id): JsonResponse
{
    $membro = $this->membro->newQuery()
        ->with(['projetos' => fn ($q) => $q->orderBy('nome')])
        ->findOrFail($id);

    return response()->json($membro, Response::HTTP_OK);
}`,
  },
  {
    id: '04-types',
    file: 'frontend/src/types/member.ts',
    start: 1,
    title: 'Tipos TypeScript — contrato do JSON',
    explain:
      '`membroProjetoType` descreve o resumo do projeto. Em `membroType`, `projetos?` é opcional (array) — bate com o que a API passa a devolver.',
    code: `export type membroProjetoType = {
  id: string
  nome: string
  nome_cliente: string
  descricao: string
  data_inicio: string
  data_fim: string
}

export type membroType = {
  id: string
  nome: string
  email: string
  // ... demais campos
  projetos?: membroProjetoType[]
}`,
  },
  {
    id: '05-member-projetos',
    file: 'frontend/.../membros/_components/member-projetos.tsx',
    start: 1,
    title: 'Componente que desenha a lista de projetos',
    explain:
      'Componente novo e só com essa responsabilidade: receber `projetos` e renderizar nome, cliente, datas (dd/mm/aaaa) e descrição. Se a lista estiver vazia, mostra aviso amigável.',
    code: `export function MemberProjetos({ projetos = [] }: MemberProjetosProps) {
  return (
    <div className="space-y-3 border-t border-border pt-4">
      <div>
        <p className="text-sm font-medium">Projetos do membro</p>
        <p className="text-xs text-muted-foreground">
          Todos os projetos em que este membro está alocado.
        </p>
      </div>
      {!projetos.length && (
        <p className="text-sm text-muted-foreground">
          Este membro ainda não está em nenhum projeto.
        </p>
      )}
      <ul className="space-y-3">
        {projetos.map((projeto) => (
          <li key={projeto.id} className="space-y-1 border-b ...">
            <p className="text-sm font-medium">{projeto.nome}</p>
            <p className="text-xs ...">Cliente: {projeto.nome_cliente}</p>
            <p className="text-xs ...">
              {formatDateBr(projeto.data_inicio)} — {formatDateBr(projeto.data_fim)}
            </p>
            {projeto.descricao && (
              <p className="text-sm ...">{projeto.descricao}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}`,
  },
  {
    id: '06-dialog-info',
    file: 'frontend/.../dialog-information-member.tsx',
    start: 29,
    title: 'Dialog de informações — onde a lista aparece',
    explain:
      'Ao clicar no ícone ℹ do membro, o modal mostra o formulário em modo leitura E, logo abaixo, `<MemberProjetos projetos={member.projetos} />`. O `overflow-y-auto` permite rolar se houver muitos projetos.',
    code: `<DialogContent className="max-h-[90vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle>Informações do membro</DialogTitle>
    <DialogDescription>
      Dados cadastrais e todos os projetos em que o membro está alocado.
    </DialogDescription>
  </DialogHeader>
  {member ? (
    <>
      <FormFieldsMember member={member} readOnly />
      <MemberProjetos projetos={member.projetos} />
    </>
  ) : (
    <SkeletonFormFieldsMember readOnly />
  )}
</DialogContent>`,
  },
  {
    id: '07-listagem',
    file: 'frontend/.../list-member.tsx',
    start: 83,
    title: 'Listagem — contagem de projetos',
    explain:
      'Na lista (mobile e tabela desktop) aparece quantos projetos o membro tem. O detalhe completo fica no dialog de informações.',
    code: `{/* Mobile */}
<p className="text-sm text-muted-foreground">
  Projetos: {member.projetos?.length ?? 0}
</p>

{/* Tabela desktop */}
<TableHead>Projetos</TableHead>
...
<TableCell>{member.projetos?.length ?? 0}</TableCell>`,
  },
  {
    id: '08-revalidate',
    file: 'frontend/src/actions/tarefa.ts',
    start: 45,
    title: 'Atualizar a tela de membros após alocar/desalocar',
    explain:
      'Quando a equipe de um projeto muda, o Next precisa “invalidar” o cache da página `/admin/membros`. Sem `revalidatePath`, a lista poderia mostrar quantidade antiga.',
    code: `if (!res.error) {
  revalidatePath('/admin/projetos')
  revalidatePath('/admin/tarefas')
  revalidatePath('/admin/membros')
}`,
  },
]

const imagePaths = []
for (const s of snippets) {
  const svgPath = join(assets, `${s.id}.svg`)
  writeFileSync(svgPath, codeToSvg(s.file, s.code, s.start), 'utf8')
  imagePaths.push({ ...s, img: `assets/projetos-membro/${s.id}.svg` })
}

const md = `# Projetos do membro — guia com imagens do código

**PS Adapti 2026.2 · material de estudo**

## O que foi pedido

Ao **selecionar / abrir as informações** de um membro, o sistema deve mostrar **todos os projetos** em que ele está alocado — não só o cadastro (nome, e-mail, etc.).

## Ideia em uma frase

A API passa a **entregar os projetos junto com o membro**; o frontend **lista esses projetos** no dialog de informações (ícone ℹ).

## Fluxo (passo a passo)

\`\`\`
Usuário clica em ℹ no membro
  → Dialog de informações abre
    → Já tem member.projetos (veio do GET /membros)
      → MemberProjetos desenha nome, cliente, datas e descrição
\`\`\`

Relação no banco (já existia):

\`\`\`
membros  ←→  membro_projeto  ←→  projetos
\`\`\`

---

${imagePaths
  .map(
    (s, i) => `## ${i + 1}. ${s.title}

**Arquivo:** \`${s.file}\` (a partir da linha **${s.start}** no código atual)

${s.explain}

### Imagem do código

![${s.title}](${s.img})

---
`,
  )
  .join('\n')}

## Como testar na tela

1. Entre em **Membros**.
2. Veja a coluna / texto **Projetos** (quantidade).
3. Clique no ícone **ℹ** de um membro que esteja em projetos.
4. Role o modal: abaixo dos dados cadastrais aparece **Projetos do membro** com nome, cliente, período e descrição.
5. Aloque ou remova o membro em **Projetos → Equipe** e volte em Membros: a quantidade e a lista devem atualizar.

## Resumo dos arquivos tocados

| Camada | Arquivo | Papel |
|---|---|---|
| Backend | \`MembroController.php\` | Eager load de \`projetos\` no index/show |
| Backend | \`Membro.php\` | Relação \`projetos()\` (já existia) |
| Frontend | \`types/member.ts\` | Tipagem de \`projetos\` |
| Frontend | \`member-projetos.tsx\` | UI da lista (novo) |
| Frontend | \`dialog-information-member.tsx\` | Encaixa a lista no modal |
| Frontend | \`list-member.tsx\` | Contagem na listagem |
| Frontend | \`actions/tarefa.ts\` | \`revalidatePath('/admin/membros')\` |

## Glossário rápido

| Termo | Significado |
|---|---|
| **Eager loading** | Carregar relações no mesmo request (\`with\`) |
| **Pivot / N:N** | Tabela do meio \`membro_projeto\` |
| **Dialog** | Modal que abre ao clicar em ℹ |
| **revalidatePath** | Diz ao Next para buscar dados novos naquela rota |

---

*Números de linha batem com o código na data de geração deste PDF. Se você editar o arquivo depois, a linha pode “descer” alguns números — o trecho continua o mesmo.*
`

const mdPath = join(__dirname, 'Projetos_do_Membro.md')
writeFileSync(mdPath, md, 'utf8')
console.log('Markdown:', mdPath)
console.log('SVGs:', assets)

// md-to-pdf
const r = spawnSync('npx', ['--yes', 'md-to-pdf', mdPath], {
  cwd: root,
  shell: true,
  stdio: 'inherit',
  env: process.env,
})

if (r.status !== 0) {
  console.error('md-to-pdf falhou com código', r.status)
  process.exit(r.status || 1)
}

const pdfDocs = join(__dirname, 'Projetos_do_Membro.pdf')
const pdfRoot = join(root, 'Projetos_do_Membro.pdf')
try {
  copyFileSync(pdfDocs, pdfRoot)
} catch {
  /* ignore */
}
console.log('PDF:', pdfDocs)
