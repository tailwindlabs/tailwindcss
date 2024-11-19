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

const esmResolver = EnhancedResolve.ResolverFactory.createResolver({
  fileSystem: new EnhancedResolve.CachedInputFileSystem(fs, 4000),
  useSyncFileSystemCalls: true,
  extensions: ['.js', '.json', '.node', '.ts'],
  conditionNames: ['node', 'import'],
})

const cjsResolver = EnhancedResolve.ResolverFactory.createResolver({
  fileSystem: new EnhancedResolve.CachedInputFileSystem(fs, 4000),
  useSyncFileSystemCalls: true,
  extensions: ['.js', '.json', '.node', '.ts'],
  conditionNames: ['node', 'require'],
})

export function resolveJsId(id: string, base: string) {
  try {
    return esmResolver.resolveSync({}, base, id)
  } catch {
    return cjsResolver.resolveSync({}, base, id)
  }
}

const resolver = EnhancedResolve.ResolverFactory.createResolver({
  fileSystem: new EnhancedResolve.CachedInputFileSystem(fs, 4000),
  useSyncFileSystemCalls: true,
  extensions: ['.css'],
  mainFields: ['style'],
  conditionNames: ['style'],
})
export function resolveCssId(id: string, base: string) {
  return resolver.resolveSync({}, base, id)
}
