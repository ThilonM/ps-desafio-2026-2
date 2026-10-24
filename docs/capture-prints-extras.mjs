/**
 * Prints extras: diálogo de equipe + formulário de tarefa.
 * Uso: node docs/capture-prints-extras.mjs
 */
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, 'prints')
const FRONT = 'http://127.0.0.1:3000'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1360, height: 860 } })

await page.goto(`${FRONT}/auth/sign-in`, { waitUntil: 'networkidle' })
await page.locator('input').nth(0).fill('test@example.com')
await page.locator('input[type="password"]').fill('password')
await page.getByRole('button', { name: 'Entrar' }).click()
await page.waitForURL(/\/admin/, { timeout: 20000 })

await page.goto(`${FRONT}/admin/projetos`, { waitUntil: 'networkidle' })
await page.waitForTimeout(700)

const equipe = page.getByRole('button', { name: /equipe/i }).first()
if (await equipe.count()) {
  await equipe.click()
  await page.waitForTimeout(900)
  await page.screenshot({ path: join(out, '06-equipe-projeto.png') })
  console.log('ok 06-equipe-projeto')
} else {
  console.log('skip 06: botão equipe não encontrado')
}

await page.goto(`${FRONT}/admin/tarefas`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
const nova = page.getByRole('button', { name: /nova tarefa/i }).first()
if (await nova.count()) {
  await nova.click()
  await page.waitForTimeout(700)
  await page.screenshot({ path: join(out, '08-tarefa-form.png') })
  console.log('ok 08-tarefa-form')
}

// Tentar capturar erro 422 da trava (alocar membro já no limite)
await page.goto(`${FRONT}/admin/projetos`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
const equipe2 = page.getByRole('button', { name: /equipe/i }).first()
if (await equipe2.count()) {
  await equipe2.click()
  await page.waitForTimeout(600)
  const select = page.locator('select, [role="combobox"]').first()
  const addBtn = page.getByRole('button', { name: /alocar|adicionar|salvar/i }).first()
  if ((await select.count()) && (await addBtn.count())) {
    await select.selectOption({ index: 1 }).catch(async () => {
      await select.click()
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
    })
    await addBtn.click()
    await page.waitForTimeout(1500)
    await page.screenshot({ path: join(out, '09-validacao-trava-422.png') })
    console.log('ok 09-validacao-trava-422')
  } else {
    console.log('skip 09: formulário de alocação incompleto')
  }
}

await browser.close()
console.log('done')
