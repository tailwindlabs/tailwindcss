import { __unstable__loadDesignSystem, compile } from '@tailwindcss/node'
import fs from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadModule } from '../../../../@tailwindcss-node/src/compile'
import { resolveConfig } from '../../../../tailwindcss/src/compat/config/resolve-config'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { error, highlight, relative } from '../../utils/renderer'
import { migratePrefixValue } from './migrate-prefix'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const css = String.raw

export async function prepareConfig(
  configFilePath: string | null,
  options: { base: string },
): Promise<{
  designSystem: DesignSystem
  sources: { base: string; pattern: string }[]
  userConfig: Config
  configFilePath: string

  newPrefix: string | null
}> {
  try {
    if (configFilePath === null) {
      configFilePath = await detectConfigPath(options.base)
    } else if (!path.isAbsolute(configFilePath)) {
      configFilePath = path.resolve(options.base, configFilePath)
    }

    // We create a relative path from the current file to the config file. This is
    // required so that the base for Tailwind CSS can bet inside the
    // @tailwindcss-upgrade package and we can require `tailwindcss` properly.
    let relative = path.relative(__dirname, configFilePath)

    // If the path points to a file in the same directory, `path.relative` will
    // remove the leading `./` and we need to add it back in order to still
    // consider the path relative
    if (!relative.startsWith('.') && !path.isAbsolute(relative)) {
      relative = './' + relative
    }

    let userConfig = await createResolvedUserConfig(configFilePath)

    let newPrefix = userConfig.prefix ? migratePrefixValue(userConfig.prefix) : null
    let input = css`
      @import 'tailwindcss' ${newPrefix ? `prefix(${newPrefix})` : ''};
      @config '${relative}';
    `

    let [compiler, designSystem] = await Promise.all([
      compile(input, { base: __dirname, onDependency: () => {} }),
      __unstable__loadDesignSystem(input, { base: __dirname }),
    ])

    return {
      designSystem,
      sources: compiler.sources,
      userConfig,
      newPrefix,
      configFilePath,
    }
  } catch (e: any) {
    error('Could not load the configuration file: ' + e.message, { prefix: '↳ ' })
    process.exit(1)
  }
}

async function createResolvedUserConfig(fullConfigPath: string): Promise<Config> {
  let [noopDesignSystem, unresolvedUserConfig] = await Promise.all([
    __unstable__loadDesignSystem(
      css`
        @import 'tailwindcss';
      `,
      { base: __dirname },
    ),
    loadModule(fullConfigPath, __dirname, () => {}).then((result) => result.module) as Config,
  ])

  return resolveConfig(noopDesignSystem, [
    { base: dirname(fullConfigPath), config: unresolvedUserConfig, reference: false },
  ]).resolvedConfig as any
}

const DEFAULT_CONFIG_FILES = [
  './tailwind.config.js',
  './tailwind.config.cjs',
  './tailwind.config.mjs',
  './tailwind.config.ts',
  './tailwind.config.cts',
  './tailwind.config.mts',
]
export async function detectConfigPath(start: string, end: string = start) {
  for (let base of parentPaths(start, end)) {
    for (let file of DEFAULT_CONFIG_FILES) {
      let fullPath = path.resolve(base, file)
      try {
        await fs.access(fullPath)
        return fullPath
      } catch {}
    }
  }

  throw new Error(
    `No configuration file found for ${highlight(relative(start))}. Please provide a path to the Tailwind CSS v3 config file via the ${highlight('--config')} option.`,
  )
}

// Yields all parent paths from `from` to `to` (inclusive on both ends)
function* parentPaths(from: string, to: string = from) {
  let fromAbsolute = path.resolve(from)
  let toAbsolute = path.resolve(to)

  if (!fromAbsolute.startsWith(toAbsolute)) {
    throw new Error(`The path ${from} is not a parent of ${to}`)
  }

  if (fromAbsolute === toAbsolute) {
    yield fromAbsolute
    return
  }

  let current = fromAbsolute
  do {
    yield current
    current = path.dirname(current)
  } while (current !== toAbsolute)
  yield toAbsolute
}
