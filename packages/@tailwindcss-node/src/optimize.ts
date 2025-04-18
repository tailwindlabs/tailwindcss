import { Features, transform } from 'lightningcss'
import MagicString from 'magic-string'

const decoder = new TextDecoder()

export function optimize(
  input: string,
  {
    file = 'input.css',
    minify = false,
    map,
  }: { file?: string; minify?: boolean; map?: string } = {},
): {
  code: string
  map: string
} {
  function optimize(code: Buffer | Uint8Array, map?: string) {
    return transform({
      filename: file,
      code: code as any,
      minify,
      sourceMap: typeof map !== 'undefined',
      inputSourceMap: map,
      drafts: {
        customMedia: true,
      },
      nonStandard: {
        deepSelectorCombinator: true,
      },
      include: Features.Nesting | Features.MediaQueries,
      exclude: Features.LogicalProperties | Features.DirSelector | Features.LightDark,
      targets: {
        safari: (16 << 16) | (4 << 8),
        ios_saf: (16 << 16) | (4 << 8),
        firefox: 128 << 16,
        chrome: 111 << 16,
      },
      errorRecovery: true,
    })
  }

  // Running Lightning CSS twice to ensure that adjacent rules are merged after
  // nesting is applied. This creates a more optimized output.
  let result = optimize(Buffer.from(input), map)
  map = result.map ? decoder.decode(result.map) : undefined
  result = optimize(result.code, map)

  // Work around an issue where the media query range syntax transpilation
  // generates code that is invalid with `@media` queries level 3.
  let out = new MagicString(result.code.toString())
  out = out.replaceAll('@media not (', '@media not all and (')

  return {
    code: out.toString(),
    map: out.generateMap().toString(),
  }
}
