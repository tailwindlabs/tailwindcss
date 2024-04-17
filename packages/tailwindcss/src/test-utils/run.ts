import { Features, transform } from 'lightningcss'
import { compile } from '..'

export function compileCss(css: string, candidates: string[] = []) {
  return optimizeCss(compile(css).build(candidates)).css.trim()
}

export function run(candidates: string[]) {
  return optimizeCss(compile('@tailwind utilities;').build(candidates)).css.trim()
}

export function optimizeCss(
  input: string,
  {
    file = 'input.css',
    minify = false,
    map = null,
  }: { file?: string; minify?: boolean; map?: any } = {},
) {
  let result = transform({
    filename: file,
    code: Buffer.from(input),
    minify,
    sourceMap: map ? true : false,
    inputSourceMap: map ? JSON.stringify(map) : undefined,
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
  })

  return {
    css: result.code.toString(),
    map: result.map ? JSON.parse(result.map.toString()) : null,
  }
}
