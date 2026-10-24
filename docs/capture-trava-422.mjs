/**
 * Captura toast/alerta 422 da trava de alocação.
 * node docs/capture-trava-422.mjs
 */
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, 'prints')
const API = 'http://127.0.0.1:8000'
const FRONT = 'http://127.0.0.1:3000'

const loginRes = await fetch(`${API}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
})
const { token } = await loginRes.json()
const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' }

const [membros, projetos] = await Promise.all([
  fetch(`${API}/membros`, { headers }).then((r) => r.json()),
  fetch(`${API}/projetos`, { headers }).then((r) => r.json()),
])

const hoje = new Date().toISOString().slice(0, 10)
const ativosIds = new Set(
  projetos
    .filter((p) => p.data_inicio <= hoje && p.data_fim >= hoje)
    .map((p) => p.id),
)

const membroNoLimite = membros.find((m) => {
  const ativos = (m.projetos || []).filter((p) => ativosIds.has(p.id))
  return ativos.length >= 2
})

if (!membroNoLimite) {
  console.log('Nenhum membro com 2 projetos ativos — skip')
  process.exit(0)
}

const projetoAlvo = projetos.find((p) => {
  if (!ativosIds.has(p.id)) return false
  const ids = (p.membros || []).map((m) => m.id)
  return !ids.includes(membroNoLimite.id)
})

if (!projetoAlvo) {
  console.log('Nenhum projeto ativo livre para forçar 422 — skip')
  process.exit(0)
}

console.log('Membro:', membroNoLimite.nome)
console.log('Projeto:', projetoAlvo.nome)

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1360, height: 860 } })

await page.goto(`${FRONT}/auth/sign-in`, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(1500)
await page.locator('input').nth(0).fill('test@example.com')
await page.locator('input[type="password"]').fill('password')
await Promise.all([
  page.waitForURL(/\/admin/, { timeout: 60000 }),
  page.getByRole('button', { name: 'Entrar' }).click(),
])
await page.waitForTimeout(1000)

await page.goto(`${FRONT}/admin/projetos`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

// Abre equipe pelo botão com title na linha do projeto alvo
const row = page.locator('tr', { hasText: projetoAlvo.nome }).first()
const equipeBtn = row.getByTitle(/equipe/i).or(row.getByRole('button').nth(1))
await equipeBtn.click()
await page.waitForTimeout(700)

// Select nativo ou custom
const select = page.locator('select').first()
if (await select.count()) {
  await select.selectOption({ label: membroNoLimite.nome }).catch(async () => {
    await select.selectOption({ value: membroNoLimite.id })
  })
} else {
  // NativeSelect / combobox shadcn
  const trigger = page.getByRole('combobox').first()
  await trigger.click()
  await page.getByRole('option', { name: new RegExp(membroNoLimite.nome, 'i') }).click()
}

await page.getByRole('button', { name: /^Alocar$/i }).click()
await page.waitForTimeout(2000)

await page.screenshot({ path: join(out, '09-validacao-trava-422.png'), fullPage: false })
console.log('salvo 09-validacao-trava-422.png')
await browser.close()
