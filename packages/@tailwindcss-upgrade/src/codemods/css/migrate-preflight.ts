import dedent from 'dedent'
import postcss, { type Plugin, type Root } from 'postcss'
import { keyPathToCssProperty } from '../../../../tailwindcss/src/compat/apply-config-to-theme'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { toKeyPath } from '../../../../tailwindcss/src/utils/to-key-path'
import * as ValueParser from '../../../../tailwindcss/src/value-parser'

// Defaults in v4
const DEFAULT_BORDER_COLOR = 'currentcolor'

const css = dedent
const BORDER_COLOR_COMPATIBILITY_CSS = css`
  /*
    The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
    so we've added these compatibility styles to make sure everything still
    looks the same as it did with Tailwind CSS v3.

    If we ever want to remove these styles, we need to add an explicit border
    color utility to any element that depends on these defaults.
  */
  @layer base {
    *,
    ::after,
    ::before,
    ::backdrop,
    ::file-selector-button {
      border-color: theme(borderColor.DEFAULT);
    }
  }
`

export function migratePreflight({
  designSystem,
  userConfig,
}: {
  designSystem: DesignSystem
  userConfig?: Config
}): Plugin {
  // @ts-expect-error
  let defaultBorderColor = userConfig?.theme?.borderColor?.DEFAULT

  function canResolveThemeValue(path: string) {
    let variable = `--${keyPathToCssProperty(toKeyPath(path))}` as const
    return Boolean(designSystem.theme.get([variable]))
  }

  function migrate(root: Root) {
    let isTailwindRoot = false
    root.walkAtRules('import', (node) => {
      if (
        /['"]tailwindcss['"]/.test(node.params) ||
        /['"]tailwindcss\/preflight['"]/.test(node.params)
      ) {
        isTailwindRoot = true
        return false
      }
    })

    if (!isTailwindRoot) return

    // Figure out the compatibility CSS to inject
    let compatibilityCssString = ''
    if (defaultBorderColor !== DEFAULT_BORDER_COLOR) {
      compatibilityCssString += BORDER_COLOR_COMPATIBILITY_CSS
      compatibilityCssString += '\n\n'
    }

    compatibilityCssString = `\n@tw-bucket compatibility {\n${compatibilityCssString}\n}\n`
    let compatibilityCss = postcss.parse(compatibilityCssString)

    // Replace the `theme(…)` with v3 values if we can't resolve the theme
    // value.
    compatibilityCss.walkDecls((decl) => {
      if (decl.value.includes('theme(')) {
        decl.value = substituteFunctionsInValue(ValueParser.parse(decl.value), (path) => {
          if (canResolveThemeValue(path)) {
            return defaultBorderColor
          } else {
            if (path === 'borderColor.DEFAULT') {
              return 'var(--color-gray-200, currentcolor)'
            }
          }
          return null
        })
      }
    })

    // Cleanup `--border-color` definition in `theme(…)`
    root.walkAtRules('theme', (node) => {
      node.walkDecls('--border-color', (decl) => {
        decl.remove()
      })

      if (node.nodes?.length === 0) {
        node.remove()
      }
    })

    // Inject the compatibility CSS
    root.append(compatibilityCss)
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-preflight',
    OnceExit: migrate,
  }
}

function substituteFunctionsInValue(
  ast: ValueParser.ValueAstNode[],
  handle: (value: string, fallback?: string) => string | null,
) {
  ValueParser.walk(ast, (node, { replaceWith }) => {
    if (node.kind === 'function' && node.value === 'theme') {
      if (node.nodes.length < 1) return

      // Ignore whitespace before the first argument
      if (node.nodes[0].kind === 'separator' && node.nodes[0].value.trim() === '') {
        node.nodes.shift()
      }

      let pathNode = node.nodes[0]
      if (pathNode.kind !== 'word') return

      let path = pathNode.value

      // For the theme function arguments, we require all separators to contain
      // comma (`,`), spaces alone should be merged into the previous word to
      // avoid splitting in this case:
      //
      // theme(--color-red-500 / 75%) theme(--color-red-500 / 75%, foo, bar)
      //
      // We only need to do this for the first node, as the fallback values are
      // passed through as-is.
      let skipUntilIndex = 1
      for (let i = skipUntilIndex; i < node.nodes.length; i++) {
        if (node.nodes[i].value.includes(',')) {
          break
        }
        path += ValueParser.toCss([node.nodes[i]])
        skipUntilIndex = i + 1
      }

      path = eventuallyUnquote(path)
      let fallbackValues = node.nodes.slice(skipUntilIndex + 1)

      let replacement =
        fallbackValues.length > 0 ? handle(path, ValueParser.toCss(fallbackValues)) : handle(path)
      if (replacement === null) return

      replaceWith(ValueParser.parse(replacement))
    }
  })

  return ValueParser.toCss(ast)
}

function eventuallyUnquote(value: string) {
  if (value[0] !== "'" && value[0] !== '"') return value

  let unquoted = ''
  let quoteChar = value[0]
  for (let i = 1; i < value.length - 1; i++) {
    let currentChar = value[i]
    let nextChar = value[i + 1]

    if (currentChar === '\\' && (nextChar === quoteChar || nextChar === '\\')) {
      unquoted += nextChar
      i++
    } else {
      unquoted += currentChar
    }
  }

  return unquoted
}
