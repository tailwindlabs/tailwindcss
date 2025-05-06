import remapping from '@ampproject/remapping'
import { Features, transform } from 'lightningcss'
import MagicString from 'magic-string'

export interface OptimizeOptions {
  /**
   * The file being transformed
   */
  file?: string

  /**
   * Enabled minified output
   */
  minify?: boolean

  /**
   * The output source map before optimization
   *
   * If omitted a resulting source map will not be available
   */
  map?: string
}

export interface TransformResult {
  code: string
  map: string | undefined
}

export function optimize(
  input: string,
  { file = 'input.css', minify = false, map }: OptimizeOptions = {},
): TransformResult {
  function optimize(code: Buffer | Uint8Array, map: string | undefined) {
    return transform({
      filename: file,
      code,
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
  map = result.map?.toString()

  result = optimize(result.code, map)
  map = result.map?.toString()

  let code = result.code.toString()

  // Work around an issue where the media query range syntax transpilation
  // generates code that is invalid with `@media` queries level 3.
  let magic = new MagicString(code)
  magic.replaceAll('@media not (', '@media not all and (')

  // We have to use a source-map-preserving method of replacing the content
  // which requires the use of Magic String + remapping(…) to make sure
  // the resulting map is correct
  if (map !== undefined && magic.hasChanged()) {
    let magicMap = magic.generateMap({ source: 'original', hires: 'boundary' }).toString()

    let remapped = remapping([magicMap, map], () => null)

    map = remapped.toString()
  }

  code = magic.toString()

  return {
    code,
    map,
  }
}
