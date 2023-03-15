import jitiFactory from 'jiti'
import { transform } from 'sucrase'

import { Config } from '../../types/config'

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

export function loadConfig(path: string): Config {
  try {
    return path ? require(path) : {}
  } catch {
    return lazyJiti()(path)
  }
}
