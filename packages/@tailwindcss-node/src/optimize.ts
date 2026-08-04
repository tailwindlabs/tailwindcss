import remapping from '@jridgewell/remapping'
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

  result.warnings = result.warnings.filter((warning) => {
    // Ignore warnings about unknown pseudo-classes as they are likely caused
    // by the use of `:deep()`, `:slotted()`, and `:global()` which are not
    // standard CSS but are commonly used in frameworks like Vue.
    if (/'(deep|slotted|global)' is not recognized as a valid pseudo-/.test(warning.message)) {
      return false
    }

    return true
  })

  // Because of `errorRecovery: true`, there could be warnings, so let's let the
  // user know about them.
  if (process.env.NODE_ENV !== 'test' && result.warnings.length > 0) {
    let lines = input.split('\n')

    let output = [
      `Found ${result.warnings.length} ${result.warnings.length === 1 ? 'warning' : 'warnings'} while optimizing generated CSS:`,
    ]

    for (let [idx, warning] of result.warnings.entries()) {
      output.push('')
      if (result.warnings.length > 1) {
        output.push(`Issue #${idx + 1}:`)
      }

      let context = 2

      let start = Math.max(0, warning.loc.line - context - 1)
      let end = Math.min(lines.length, warning.loc.line + context)

      let snippet = lines.slice(start, end).map((line, idx) => {
        if (start + idx + 1 === warning.loc.line) {
          return `${dim(`\u2502`)} ${line}`
        } else {
          return dim(`\u2502 ${line}`)
        }
      })

      snippet.splice(
        warning.loc.line - start,
        0,
        `${dim('\u2506')}${' '.repeat(warning.loc.column - 1)} ${yellow(`${dim('^--')} ${warning.message}`)}`,
        `${dim('\u2506')}`,
      )

      output.push(...snippet)
    }
    output.push('')

    console.warn(output.join('\n'))
  }

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

function dim(str: string) {
  return `\x1B[2m${str}\x1B[22m`
}

function yellow(str: string) {
  return `\x1B[33m${str}\x1B[39m`
}
