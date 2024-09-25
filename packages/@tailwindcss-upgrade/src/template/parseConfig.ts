import { __unstable__loadDesignSystem, compile } from '@tailwindcss/node'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'

export async function parseConfig(
  path: string,
  options: { base: string },
): Promise<{ designSystem: DesignSystem; globs: { base: string; pattern: string }[] }> {
  // TODO: base path needs to be resolved to v4
  let input = `@import 'tailwindcss';\n@config './${path}'`

  let [compiler, designSystem] = await Promise.all([
    compile(input, { ...options, onDependency: () => {} }),
    __unstable__loadDesignSystem(input, options),
  ])
  return { designSystem, globs: compiler.globs }
}
