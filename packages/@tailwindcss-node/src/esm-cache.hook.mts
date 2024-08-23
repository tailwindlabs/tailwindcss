import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

if (typeof require === 'undefined') {
  register(import.meta.resolve('@tailwindcss/node/esm-cache-loader'))
} else {
  register(pathToFileURL(require.resolve('@tailwindcss/node/esm-cache-loader')))
}
