import { createJiti, type Jiti } from 'jiti'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { compile as _compile } from 'tailwindcss'
import { getModuleDependencies } from './get-module-dependencies'

export async function compile(
  css: string,
  { base, onDependency }: { base: string; onDependency: (path: string) => void },
) {
  return await _compile(css, {
    loadPlugin: async (pluginPath) => {
      if (pluginPath[0] !== '.') {
        return importNativeAndJiti(pluginPath).then((m: any) => m.default ?? m)
      }

      let resolvedPath = path.resolve(base, pluginPath)
      let [module, moduleDependencies] = await Promise.all([
        importNativeAndJiti(pathToFileURL(resolvedPath).href + '?id=' + Date.now()),
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
        return importNativeAndJiti(configPath).then((m: any) => m.default ?? m)
      }

      let resolvedPath = path.resolve(base, configPath)
      let [module, moduleDependencies] = await Promise.all([
        importNativeAndJiti(pathToFileURL(resolvedPath).href + '?id=' + Date.now()),
        getModuleDependencies(resolvedPath),
      ])

      onDependency(resolvedPath)
      for (let file of moduleDependencies) {
        onDependency(file)
      }
      return module.default ?? module
    },
  })
}

let jiti: null | Jiti = null
async function importNativeAndJiti(path: string): Promise<any> {
  try {
    return await import(path)
  } catch (error) {
    try {
      if (!jiti) {
        jiti = createJiti(import.meta.url)
      }
      return await jiti.import(path)
    } catch {}
    throw error
  }
}
