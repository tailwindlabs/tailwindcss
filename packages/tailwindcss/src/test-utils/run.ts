import { Features, transform } from 'lightningcss'
import { compile } from '..'
import { type UserConfig } from '../config'

export function compileCss(css: string, candidates: string[] = [], config: UserConfig = {}) {
  return optimizeCss(compile(css, config).build(candidates)).trim()
}

export function run(candidates: string[], config: UserConfig = {}) {
  return optimizeCss(compile('@tailwind utilities;', config).build(candidates)).trim()
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
