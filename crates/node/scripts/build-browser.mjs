import { spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// The pinned NAPI CLI only supports wasm32-wasip1-threads. Build the same bindings with
// Cargo directly so browsers can use them without shared memory or cross-origin isolation.
let root = fileURLToPath(new URL('../../../', import.meta.url))
let linkDir = fileURLToPath(new URL('./lib/wasm32-wasip1', import.meta.resolve('emnapi')))
let result = spawnSync(
  'cargo',
  [
    'build',
    '--release',
    '--locked',
    '--package',
    'tailwind-oxide',
    '--target',
    'wasm32-wasip1',
    '--message-format=json-render-diagnostics',
  ],
  {
    cwd: root,
    stdio: ['inherit', 'pipe', 'inherit'],
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    env: { ...process.env, EMNAPI_LINK_DIR: linkDir },
  },
)
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)

// Read the artifact path from Cargo, since its target directory can be configured elsewhere.
let wasmPaths = result.stdout
  .split('\n')
  .filter((line) => line.startsWith('{'))
  .map((line) => JSON.parse(line))
  .filter((message) => message.reason === 'compiler-artifact')
  .filter((message) => message.target.kind.includes('cdylib'))
  .flatMap((message) => message.filenames.filter((file) => file.endsWith('.wasm')))
if (wasmPaths.length !== 1) {
  throw new Error(`Expected one .wasm artifact from Cargo, got: ${JSON.stringify(wasmPaths)}`)
}
let wasm = await fs.readFile(wasmPaths[0])

// Link the module against the memory `browser.mjs` creates, so a module that needs more memory
// (or shared memory) fails the build instead of failing in every browser.
let loader = await fs.readFile(new URL('../npm/wasm32-wasi/browser.mjs', import.meta.url), 'utf8')
let initial = Number(loader.match(/const INITIAL_MEMORY_PAGES = (\d+)/)?.[1])
let module = new WebAssembly.Module(wasm)
let imports = {}
for (let { module: namespace, name, kind } of WebAssembly.Module.imports(module)) {
  imports[namespace] ??= {}
  imports[namespace][name] =
    kind === 'memory' ? new WebAssembly.Memory({ initial, maximum: 65536 }) : () => {}
}
if (!imports.env?.memory) throw new Error('The browser build must import `env.memory`')
new WebAssembly.Instance(module, imports)

await fs.writeFile(
  new URL('../npm/wasm32-wasi/tailwindcss-oxide.browser.wasm', import.meta.url),
  wasm,
)
console.log(`Copied ${wasmPaths[0]} to npm/wasm32-wasi/tailwindcss-oxide.browser.wasm`)
