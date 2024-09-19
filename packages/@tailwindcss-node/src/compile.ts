import EnhancedResolve from 'enhanced-resolve'
import { createJiti, type Jiti } from 'jiti'
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path, { basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import { compile as _compile } from 'tailwindcss'
import { getModuleDependencies } from './get-module-dependencies'

export async function compile(
  css: string,
  { base, onDependency }: { base: string; onDependency: (path: string) => void },
) {
  return await _compile(css, base, {
    async loadModule(id, base) {
      if (id[0] !== '.') {
        let resolvedPath = require.resolve(id, { paths: [base] })

        let module = await importModule(pathToFileURL(resolvedPath).href)
        return {
          base: basename(resolvedPath),
          module: module.default ?? module,
        }
      }

      let resolvedPath = require.resolve(id, { paths: [base] })
      let [module, moduleDependencies] = await Promise.all([
        importModule(pathToFileURL(resolvedPath).href + '?id=' + Date.now()),
        getModuleDependencies(resolvedPath),
      ])

      onDependency(resolvedPath)
      for (let file of moduleDependencies) {
        onDependency(file)
      }
      return {
        base: basename(resolvedPath),
        module: module.default ?? module,
      }
    },

    async loadStylesheet(id, basedir) {
      let resolvedPath = await resolveCssId(id, basedir)
      if (!resolvedPath) throw new Error(`Could not resolve '${id}' from '${basedir}'`)
      let file = await fsPromises.readFile(resolvedPath, 'utf-8')
      return {
        base: path.dirname(resolvedPath),
        content: file,
      }
    },
  })
}

// Attempts to import the module using the native `import()` function. If this
// fails, it sets up `jiti` and attempts to import this way so that `.ts` files
// can be resolved properly.
let jiti: null | Jiti = null
async function importModule(path: string): Promise<any> {
  try {
    return await import(path)
  } catch (error) {
    try {
      jiti ??= createJiti(import.meta.url, { moduleCache: false, fsCache: false })
      return await jiti.import(path)
    } catch {}
    throw error
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
  if (typeof globalThis.__tw_resolve === 'function') {
    let resolved = globalThis.__tw_resolve(id, base)
    if (resolved) {
      return resolved
    }
  }

  return resolver.resolveSync({}, base, id)
}
