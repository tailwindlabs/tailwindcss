import { createRequire } from 'node:module'

export const resolve = createRequire(import.meta.url).resolve
