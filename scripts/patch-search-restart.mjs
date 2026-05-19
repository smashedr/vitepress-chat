import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const chunkPath = resolve(
  __dirname,
  '../node_modules/vitepress/dist/node/chunk-D3CUZ4fa.js',
)

try {
  let code = readFileSync(chunkPath, 'utf-8')
  if (code.includes('indexByLocales.clear();')) {
    console.log('[postinstall] vitepress local-search restart fix already applied')
    process.exit(0)
  }
  code = code.replace(
    'async function scanForBuild() {',
    'async function scanForBuild() {\n    indexByLocales.clear();',
  )
  writeFileSync(chunkPath, code, 'utf-8')
  console.log('[postinstall] patched vitepress local-search restart bug')
} catch (e) {
  console.warn('[postinstall] could not patch vitepress search restart:', e.message)
}
