import { Features, transform } from 'lightningcss'
import { compile } from '..'

export function compileCss(css: string, candidates: string[] = []) {
  return optimizeCss(compile(css).build(candidates)).trim()
}

export function run(candidates: string[]) {
  return optimizeCss(compile('@tailwind utilities;').build(candidates)).trim()
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
