import EnhancedResolve from 'enhanced-resolve'
import fs from 'node:fs'
import { createRequire } from 'node:module'

const localResolve = createRequire(import.meta.url).resolve
export function resolve(id: string) {
  if (typeof globalThis.__tw_resolve === 'function') {
    let resolved = globalThis.__tw_resolve(id)
    if (resolved) {
      return resolved
    }
  }
  return localResolve(id)
}

const resolver = EnhancedResolve.ResolverFactory.createResolver({
  fileSystem: new EnhancedResolve.CachedInputFileSystem(fs, 4000),
  useSyncFileSystemCalls: true,
  extensions: ['.css'],
  mainFields: ['style'],
  conditionNames: ['style'],
})
export function resolveCssId(id: string, base: string) {
  if (typeof globalThis.__tw_resolve === 'function') {
    let resolved = globalThis.__tw_resolve(id, base)
    if (resolved) {
      return resolved
    }
  }

  return resolver.resolveSync({}, base, id)
}
