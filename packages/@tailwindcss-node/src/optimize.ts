import { Features, transform } from 'lightningcss'

export function optimize(
  input: string,
  { file = 'input.css', minify = false }: { file?: string; minify?: boolean } = {},
): string {
  function optimize(code: Buffer | Uint8Array) {
    return transform({
      filename: file,
      code: code as any,
      minify,
      sourceMap: false,
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
    }).code
  }

  // Running Lightning CSS twice to ensure that adjacent rules are merged after
  // nesting is applied. This creates a more optimized output.
  let out = optimize(optimize(Buffer.from(input))).toString()

  // Work around an issue where the media query range syntax transpilation
  // generates code that is invalid with `@media` queries level 3.
  out = out.replaceAll('@media not (', '@media not all and (')

  return out
}
