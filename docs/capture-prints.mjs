/**
 * Captura prints para o README (Missão 3).
 * Uso: node docs/capture-prints.mjs
 * Pré-requisito: frontend :3000 e backend :8000 rodando.
 */
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, 'prints')
mkdirSync(out, { recursive: true })

const FRONT = process.env.FRONT_URL || 'http://127.0.0.1:3000'
const API_DOCS = process.env.API_DOCS_URL || 'http://127.0.0.1:8000/docs/api'
const EMAIL = process.env.DEMO_EMAIL || 'test@example.com'
const PASSWORD = process.env.DEMO_PASSWORD || 'password'

async function shot(page, name, fullPage = true) {
  const path = join(out, `${name}.png`)
  await page.screenshot({ path, fullPage })
  console.log('ok', name)
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1360, height: 860 } })

await page.goto(API_DOCS, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await shot(page, '01-swagger-openapi')

await page.goto(`${FRONT}/auth/sign-in`, { waitUntil: 'networkidle' })
await shot(page, '02-login', false)

await page.fill('input[type="email"], input[name="email"], input[placeholder*="e-mail" i]', EMAIL)
await page.fill('input[type="password"]', PASSWORD)
await page.click('button:has-text("Entrar")')
await page.waitForURL(/\/admin/, { timeout: 20000 })
await page.waitForTimeout(1200)
await shot(page, '03-home-admin-feriados')

await page.goto(`${FRONT}/admin/membros`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await shot(page, '04-membros')

await page.goto(`${FRONT}/admin/projetos`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await shot(page, '05-projetos')

const equipeBtn = page.locator('button, a').filter({ hasText: /equipe|alocar|membros/i }).first()
if (await equipeBtn.count()) {
  await equipeBtn.click().catch(() => {})
  await page.waitForTimeout(800)
  await shot(page, '06-equipe-projeto', false)
}

await page.goto(`${FRONT}/admin/tarefas`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await shot(page, '07-tarefas')

const novo = page.locator('button').filter({ hasText: /nova|criar|adicionar/i }).first()
if (await novo.count()) {
  await novo.click().catch(() => {})
  await page.waitForTimeout(600)
  await shot(page, '08-tarefa-form', false)
}

await browser.close()
console.log('Prints em', out)
