import { Features, transform } from 'lightningcss'
import { compile } from '..'

export async function compileCss(
  css: string,
  candidates: string[] = [],
  options: Parameters<typeof compile>[1] = {},
) {
  let { build } = await compile(css, options)
  return optimizeCss(build(candidates)).trim()
}

export async function run(candidates: string[]) {
  let { build } = await compile('@tailwind utilities;')
  return optimizeCss(build(candidates)).trim()
}

export function optimizeCss(
  input: string,
  { file = 'input.css', minify = false }: { file?: string; minify?: boolean } = {},
) {
  function optimize(code: Buffer | Uint8Array) {
    return transform({
      filename: file,
      code,
      minify,
      sourceMap: false,
      drafts: {
        customMedia: true,
      },
      nonStandard: {
        deepSelectorCombinator: true,
      },
      include: Features.Nesting,
      exclude: Features.LogicalProperties | Features.DirSelector | Features.LightDark,
      targets: {
        safari: (16 << 16) | (4 << 8),
        ios_saf: (16 << 16) | (4 << 8),
        firefox: 128 << 16,
        chrome: 111 << 16,
      },
      errorRecovery: true,
    }).code
  }

  // Running Lightning CSS twice to ensure that adjacent rules are merged after
  // nesting is applied. This creates a more optimized output.
  return optimize(optimize(Buffer.from(input))).toString()
}
