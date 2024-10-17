import { Features, transform } from 'lightningcss'
import { compile } from '..'

export async function compileCss(css: string, candidates: string[] = [], options = {}) {
  let { build } = await compile(css, options)
  return optimizeCss(build(candidates)).trim()
}

export async function run(candidates: string[]) {
  let { build } = await compile('@tailwind utilities;')
  return optimizeCss(build(candidates)).trim()
}

export async function build(candidates: string[]) {
  let { build } = await compile('@tailwind utilities;')
  return build(candidates).trim()
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
