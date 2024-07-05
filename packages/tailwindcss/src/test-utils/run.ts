import { Features, transform } from 'lightningcss'
import { compile } from '..'
import { type UserConfig } from '../config'
import type { Plugin } from '../plugins'

export function compileCss(css: string, candidates: string[] = [], config: UserConfig = {}) {
  return optimizeCss(compile(css, config).build(candidates)).trim()
}

export function run(candidates: string[], config: UserConfig = {}) {
  return optimizeCss(compile('@tailwind utilities;', config).build(candidates)).trim()
}

export async function compileWithPlugins(
  css: string,
  candidates: string[],
  config: UserConfig = {},
) {
  let builder = compile(css, config)

  let plugins: Plugin[] = await Promise.all(
    builder.plugins.map((pluginPath) => import(pluginPath).then((mod) => mod.default)),
  )

  config.plugins = [...(config.plugins ?? []), ...plugins]

  return optimizeCss(builder.build(candidates)).trim()
}

export function optimizeCss(
  input: string,
  { file = 'input.css', minify = false }: { file?: string; minify?: boolean } = {},
) {
  return transform({
    filename: file,
    code: Buffer.from(input),
    minify,
    sourceMap: false,
    drafts: {
      customMedia: true,
    },
    nonStandard: {
      deepSelectorCombinator: true,
    },
    include: Features.Nesting,
    exclude: Features.LogicalProperties,
    targets: {
      safari: (16 << 16) | (4 << 8),
    },
    errorRecovery: true,
  }).code.toString()
}
