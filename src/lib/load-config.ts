import jitiFactory from 'jiti'
import { transform } from 'sucrase'
import { Config } from '../../types/config'
import getModuleDependencies from './getModuleDependencies'

let jiti: ReturnType<typeof jitiFactory> | null = null
function lazyJiti() {
  return (
    jiti ??
    (jiti = jitiFactory(__filename, {
      interopDefault: true,
      transform: (opts) => {
        return transform(opts.source, {
          transforms: ['typescript', 'imports'],
        })
      },
    }))
  )
}

export function load(path: string) {
  let config: Config = (() => {
    try {
      return path ? require(path) : {}
    } catch {
      return lazyJiti()(path)
    }
  })()

  let deps = dependencies(path)

  return {
    config,
    dependencies: deps,
    dispose() {
      for (let file of deps) {
        delete require.cache[require.resolve(file)]
      }
    },
  }
}

export function dependencies(path: string) {
  return new Set(getModuleDependencies(path).map(({ file }) => file))
}
