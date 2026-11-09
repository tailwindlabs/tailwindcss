import { getDefaultContext, instantiateNapiModuleSync, WASI } from '@napi-rs/wasm-runtime'
import { memfs } from '@napi-rs/wasm-runtime/fs'

export const { fs: __fs, vol: __volume } = memfs()

let wasi = new WASI({
  version: 'preview1',
  fs: __fs,
  preopens: { '/': '/' },
})

// Non-shared memory, so no SharedArrayBuffer is needed. `scripts/build-browser.mjs` reads this
// constant to check that the module fits.
const INITIAL_MEMORY_PAGES = 2048
let memory = new WebAssembly.Memory({ initial: INITIAL_MEMORY_PAGES, maximum: 65536 })
let response = await fetch(new URL('./tailwindcss-oxide.browser.wasm', import.meta.url))
if (!response.ok) throw new Error(`Failed to load Oxide WebAssembly: ${response.status}`)

let { napiModule } = instantiateNapiModuleSync(await response.arrayBuffer(), {
  context: getDefaultContext(),
  wasi,
  asyncWorkPoolSize: 0,
  overwriteImports(imports) {
    imports.env = { ...imports.env, ...imports.napi, ...imports.emnapi, memory }
    return imports
  },
  beforeInit({ instance }) {
    for (let name of Object.keys(instance.exports)) {
      if (name.startsWith('__napi_register__')) instance.exports[name]()
    }
  },
})

export const { Scanner } = napiModule.exports
export default napiModule.exports
