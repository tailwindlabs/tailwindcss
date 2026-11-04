import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import url from 'node:url'

// Smoke test of the packed `@tailwindcss/oxide-wasm32-wasi` package, so that a
// broken wasm build fails here instead of after it is published.
//
// Usage: node ./scripts/check-wasm-package.mjs [path/to/package.tgz]

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
let root = path.resolve(__dirname, '..')
let tarball = path.resolve(
  process.argv[2] ?? path.join(root, 'dist', 'tailwindcss-oxide-wasm32-wasi.tgz'),
)

const TIMEOUT = 30_000

let tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'tailwindcss-oxide-wasm-'))
let error = await check().finally(() => fs.rm(tmp, { recursive: true, force: true }))

if (error) {
  console.error(`\n[check-wasm-package] ${tarball}: ${error}\n`)
  process.exit(1)
}

async function check() {
  execFileSync('tar', ['-xzf', tarball, '-C', tmp])
  let pkg = path.join(tmp, 'package')

  // Without `_initialize`, the thread setup of wasi-libc never runs, and
  // loading the module hangs forever. See `crates/node/build.rs`.
  let wasm = await fs.readFile(path.join(pkg, 'tailwindcss-oxide.wasm32-wasi.wasm'))
  let exports = WebAssembly.Module.exports(await WebAssembly.compile(wasm))
  if (!exports.some((e) => e.name === '_initialize')) {
    return 'The wasm module does not export `_initialize`.'
  }

  // Load the package in a child process, because a hang in the module blocks
  // the thread that loads it.
  let script = `
    let { Scanner } = require(${JSON.stringify(pkg)})
    let scanner = new Scanner({ sources: [] })
    let candidates = scanner.scanFiles([{ content: '<div class="flex underline">', extension: 'html' }])
    if (!candidates.includes('flex') || !candidates.includes('underline')) {
      throw new Error('Unexpected candidates: ' + JSON.stringify(candidates))
    }
    process.exit(0)
  `
  let start = performance.now()
  let result = spawnSync(process.execPath, ['-e', script], { timeout: TIMEOUT, stdio: 'inherit' })
  let duration = Math.round(performance.now() - start)

  if (result.error?.code === 'ETIMEDOUT') {
    return `Loading the package did not finish within ${TIMEOUT}ms.`
  } else if (result.error) {
    return `Loading the package failed: ${result.error.message}`
  } else if (result.status !== 0) {
    return `Loading the package failed with exit code ${result.status ?? result.signal}.`
  }

  console.log(`Loaded ${tarball} in ${duration}ms`)
}
