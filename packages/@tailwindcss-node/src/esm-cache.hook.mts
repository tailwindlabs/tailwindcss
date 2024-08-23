import { createRequire, register } from 'node:module'
import { pathToFileURL } from 'node:url'
let localRequire = createRequire(import.meta.url)

register(pathToFileURL(localRequire.resolve('@tailwindcss/node/esm-cache-loader')))
