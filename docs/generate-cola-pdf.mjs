/**
 * Gera o PDF cola da apresentação.
 * Uso: node docs/generate-cola-pdf.mjs
 */
import { copyFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const mdPath = join(__dirname, 'COLA_APRESENTACAO.md')

const r = spawnSync('npx', ['--yes', 'md-to-pdf', mdPath], {
  cwd: root,
  shell: true,
  stdio: 'inherit',
  env: process.env,
})

if (r.status !== 0) {
  console.error('md-to-pdf falhou', r.status)
  process.exit(r.status || 1)
}

const pdfDocs = join(__dirname, 'COLA_APRESENTACAO.pdf')
const pdfRoot = join(root, 'COLA_APRESENTACAO.pdf')
try {
  copyFileSync(pdfDocs, pdfRoot)
} catch {
  /* ignore */
}
console.log('PDF:', pdfDocs)
console.log('Cópia na raiz:', pdfRoot)
