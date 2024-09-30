import { __unstable__loadDesignSystem, compile, loadModule } from '@tailwindcss/node'
import path from 'node:path'
import { dirname } from 'path'
import type { Config } from 'tailwindcss'
import { fileURLToPath } from 'url'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'
import { migratePrefix } from './codemods/prefix'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let css = String.raw

export async function parseConfig(
  configPath: string,
  options: { base: string },
): Promise<{
  designSystem: DesignSystem
  globs: { base: string; pattern: string }[]
  userConfig: Config

  newPrefix: string | null
}> {
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

  let userConfig = (await loadModule(fullConfigPath, __dirname, () => {}).then(
    (result) => result.module,
  )) as Config

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
}
