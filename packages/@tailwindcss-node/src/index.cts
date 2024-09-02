import * as Module from 'node:module'
import { pathToFileURL } from 'node:url'
export * from './compile'

// In Bun, ESM modules will also populate `require.cache`, so the module hook is
// not necessary.
if (!process.versions.bun) {
  Module.register(pathToFileURL(require.resolve('@tailwindcss/node/esm-cache-loader')))
}
