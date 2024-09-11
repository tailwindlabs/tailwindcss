import EnhancedResolve from 'enhanced-resolve'
import { createJiti, type Jiti } from 'jiti'
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { compile as _compile } from 'tailwindcss'
import { getModuleDependencies } from './get-module-dependencies'

export async function compile(
  css: string,
  { base, onDependency }: { base: string; onDependency: (path: string) => void },
) {
  return await _compile(css, base, {
    loadPlugin: async (pluginPath) => {
      if (pluginPath[0] !== '.') {
        return importModule(pluginPath).then((m) => m.default ?? m)
      }

      let resolvedPath = path.resolve(base, pluginPath)
      let [module, moduleDependencies] = await Promise.all([
        importModule(pathToFileURL(resolvedPath).href + '?id=' + Date.now()),
        getModuleDependencies(resolvedPath),
      ])

      onDependency(resolvedPath)
      for (let file of moduleDependencies) {
        onDependency(file)
      }
      return module.default ?? module
    },

    loadConfig: async (configPath) => {
      if (configPath[0] !== '.') {
        return importModule(configPath).then((m) => m.default ?? m)
      }

      let resolvedPath = path.resolve(base, configPath)
      let [module, moduleDependencies] = await Promise.all([
        importModule(pathToFileURL(resolvedPath).href + '?id=' + Date.now()),
        getModuleDependencies(resolvedPath),
      ])

      onDependency(resolvedPath)
      for (let file of moduleDependencies) {
        onDependency(file)
      }
      return module.default ?? module
    },

    async resolveImport(id, basedir) {
      let full = await resolveCssId(id, basedir)
      if (!full) throw new Error(`Could not resolve '${id}' from '${basedir}'`)
      let file = await fsPromises.readFile(full, 'utf-8')
      return {
        content: file,
        basedir: path.dirname(full),
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
