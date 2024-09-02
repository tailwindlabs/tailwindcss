import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { compile as _compile } from 'tailwindcss'
import { getModuleDependencies } from './get-module-dependencies'

export async function compile(
  css: string,
  { base, onDependency }: { base: string; onDependency: (path: string) => void },
) {
  // @ts-ignore
  await import('@tailwindcss/node/esm-cache-hook')

  return await _compile(css, {
    loadPlugin: async (pluginPath) => {
      if (pluginPath[0] !== '.') {
        return import(pluginPath).then((m) => m.default ?? m)
      }

      let resolvedPath = path.resolve(base, pluginPath)
      let [module, moduleDependencies] = await Promise.all([
        import(pathToFileURL(resolvedPath).href + '?id=' + Date.now()),
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
        return import(configPath).then((m) => m.default ?? m)
      }

      let resolvedPath = path.resolve(base, configPath)
      let [module, moduleDependencies] = await Promise.all([
        import(pathToFileURL(resolvedPath).href + '?id=' + Date.now()),
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
