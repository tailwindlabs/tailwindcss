import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
let root = path.resolve(__dirname, '..')
const tailwindcssOxideRoot = path.join(root)

// Move napi artifacts into sub packages
for (let file of await fs.readdir(tailwindcssOxideRoot)) {
  if (file.startsWith('tailwindcss-oxide.') && file.endsWith('.node')) {
    let target = file.split('.')[1]
    await fs.cp(
      path.join(tailwindcssOxideRoot, file),
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
for (let file of await fs.readdir(tailwindcssOxideRoot)) {
  if (!wasmArtifacts[file]) continue
  await fs.cp(
    path.join(tailwindcssOxideRoot, file),
    path.join(tailwindcssOxideRoot, 'npm', 'wasm32-wasi', wasmArtifacts[file]),
  )
  console.log(`Moved ${file} to npm/wasm32-wasi`)
}
