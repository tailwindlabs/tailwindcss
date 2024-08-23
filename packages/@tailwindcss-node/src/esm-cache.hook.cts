import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

register(pathToFileURL(require.resolve('@tailwindcss/node/esm-cache-loader')))
