import { __unstable__loadDesignSystem, compile } from '@tailwindcss/node'
import fs from 'node:fs/promises'
import path from 'node:path'
import { dirname } from 'path'
import type { Config } from 'tailwindcss'
import { fileURLToPath } from 'url'
import { loadModule } from '../../../@tailwindcss-node/src/compile'
import { resolveConfig } from '../../../tailwindcss/src/compat/config/resolve-config'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'
import { error } from '../utils/renderer'
import { migratePrefix } from './codemods/prefix'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let css = String.raw

export async function prepareConfig(
  configPath: string | null,
  options: { base: string },
): Promise<{
  designSystem: DesignSystem
  globs: { base: string; pattern: string }[]
  userConfig: Config

  newPrefix: string | null
}> {
  try {
    if (configPath === null) {
      configPath = await detectConfigPath(options.base)
    }

    // We create a relative path from the current file to the config file. This is
    // required so that the base for Tailwind CSS can bet inside the
    // @tailwindcss-upgrade package and we can require `tailwindcss` properly.
    let fullConfigPath = path.resolve(options.base, configPath)
    let fullFilePath = path.resolve(__dirname)
    let relative = path.relative(fullFilePath, fullConfigPath)
    // If the path points to a file in the same directory, `path.relative` will
    // remove the leading `./` and we need to add it back in order to still
    // consider the path relative
    if (!relative.startsWith('.')) {
      relative = './' + relative
    }

    let userConfig = await createResolvedUserConfig(fullConfigPath)

    let newPrefix = userConfig.prefix ? migratePrefix(userConfig.prefix) : null
    let input = css`
      @import 'tailwindcss' ${newPrefix ? `prefix(${newPrefix})` : ''};
      @config './${relative}';
    `

    let [compiler, designSystem] = await Promise.all([
      compile(input, { base: __dirname, onDependency: () => {} }),
      __unstable__loadDesignSystem(input, { base: __dirname }),
    ])

    return { designSystem, globs: compiler.globs, userConfig, newPrefix }
  } catch (e: any) {
    error('Could not load the configuration file: ' + e.message)
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
    { base: dirname(fullConfigPath), config: unresolvedUserConfig },
  ]) as any
}

const DEFAULT_CONFIG_FILES = [
  './tailwind.config.js',
  './tailwind.config.cjs',
  './tailwind.config.mjs',
  './tailwind.config.ts',
  './tailwind.config.cts',
  './tailwind.config.mts',
]
async function detectConfigPath(base: string) {
  for (let file of DEFAULT_CONFIG_FILES) {
    let fullPath = path.resolve(base, file)
    try {
      await fs.access(fullPath)
      return file
    } catch {}
  }
  throw new Error(
    'No configuration file found. Please provide a path to the Tailwind CSS v3 config file via the `--config` option.',
  )
}
