import { Features, transform } from 'lightningcss'

export interface OptimizeOptions {
  /**
   * The file being transformed
   */
  file?: string

  /**
   * Enabled minified output
   */
  minify?: boolean
}

export interface TransformResult {
  code: string
}

export function optimize(
  input: string,
  { file = 'input.css', minify = false }: OptimizeOptions = {},
): TransformResult {
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
  let result = optimize(Buffer.from(input))
  result = optimize(result.code)

  let code = result.code.toString()
  code = code.replaceAll('@media not (', '@media not all and (')

  return {
    code,
  }
}
