import { createRequire } from 'node:module'

const localResolve = createRequire(import.meta.url).resolve

export function resolve(id: string, baseDir?: string) {
  if (typeof globalThis.__tw_resolve === 'function') {
    return globalThis.__tw_resolve(id, baseDir)
  }
  return localResolve(id, baseDir ? { paths: [baseDir] } : undefined)
}
