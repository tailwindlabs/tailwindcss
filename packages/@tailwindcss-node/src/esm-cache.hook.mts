import * as Module from 'node:module'
import { pathToFileURL } from 'node:url'

// In Bun, ESM modules will also populate `require.cache`, so the module hook is
// not necessary.
if (!process.versions.bun) {
  let localRequire = Module.createRequire(import.meta.url)
  Module.register(pathToFileURL(localRequire.resolve('@tailwindcss/node/esm-cache-loader')))
}
