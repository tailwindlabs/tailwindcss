import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const tailwindcssOxideRoot = root
const artifactsRoot = path.join(tailwindcssOxideRoot, 'artifacts')

let hasArtifactsDir = false
try {
  await fs.access(artifactsRoot)
  hasArtifactsDir = true
} catch {}

if (!hasArtifactsDir) {
  console.warn('No artifacts directory found, skipping artifact move step.')
  process.exit(0)
}

// Move napi artifacts into sub packages
for (let file of await fs.readdir(artifactsRoot)) {
  if (file.startsWith('tailwindcss-oxide.') && file.endsWith('.node')) {
    let target = file.split('.')[1]
    await fs.cp(
      path.join(artifactsRoot, file),
      path.join(tailwindcssOxideRoot, 'npm', target, file),
    )
    console.log(`Moved ${file} to npm/${target}`)
  }
}

// Move napi wasm artifacts into sub package
let wasmArtifacts = {
  'tailwindcss-oxide.debug.wasm': 'tailwindcss-oxide.wasm32-wasi.debug.wasm',
  'tailwindcss-oxide.wasm': 'tailwindcss-oxide.wasm32-wasi.wasm',
  'tailwindcss-oxide.wasi-browser.js': 'tailwindcss-oxide.wasi-browser.js',
  'tailwindcss-oxide.wasi.cjs': 'tailwindcss-oxide.wasi.cjs',
  'wasi-worker-browser.mjs': 'wasi-worker-browser.mjs',
  'wasi-worker.mjs': 'wasi-worker.mjs',
}

for (let file of await fs.readdir(artifactsRoot)) {
  if (!wasmArtifacts[file]) continue
  const source = path.join(artifactsRoot, file)
  await fs.cp(source, path.join(tailwindcssOxideRoot, 'npm', 'wasm32-wasi', wasmArtifacts[file]))
  console.log(`Moved ${file} to npm/wasm32-wasi`)
  await fs.rm(source, { force: true })
}

