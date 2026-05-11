import * as Module from 'node:module'
import { pathToFileURL } from 'node:url'
import * as env from './env'
import { resolveSync } from './esm-cache.loader.mjs'
export * from './compile'
export * from './instrumentation'
export * from './normalize-path'
export * from './optimize'
export * from './source-maps'
export { env }

// In Bun, ESM modules will also populate `require.cache`, so the module hook is
// not necessary.
if (!process.versions.bun) {
  let localRequire = Module.createRequire(import.meta.url)

  // `Module#register` was added in Node v18.19.0 and v20.6.0
  // `Module#registerHooks` was added in Node v22.15.0 and v23.5.0 and is the preferred API since v25.9.0,
  // runtime-deprecating `Module#register` since v26
  //
  // Not calling it means that while ESM dependencies don't get reloaded, the
  // actual included files will because they cache bust directly via `?id=…`
  if (Module.registerHooks) {
    Module.registerHooks({ resolve: resolveSync })
  } else {
    Module.register?.(pathToFileURL(localRequire.resolve('@tailwindcss/node/esm-cache-loader')))
  }
}
