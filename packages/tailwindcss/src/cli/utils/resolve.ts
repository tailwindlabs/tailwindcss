import { createRequire } from 'node:module'

export const resolve =
  typeof require?.resolve !== 'undefined' ? require.resolve : createRequire(import.meta.url).resolve
