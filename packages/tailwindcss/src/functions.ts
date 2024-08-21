import { walk, type AstNode } from './ast'
import type { PluginAPI } from './plugin-api'
import { withAlpha } from './utilities'
import {
  toCss as toValueCss,
  walk as walkValues,
  type AstNode as ValueAstNode,
} from './value-parser/ast'
import * as ValueParser from './value-parser/parser'

export const THEME_FUNCTION_INVOCATION = 'theme('

export function substituteFunctions(ast: AstNode[], pluginApi: PluginAPI) {
  walk(ast, (node) => {
    // Find all declaration values
    if (node.kind === 'declaration' && node.value?.includes(THEME_FUNCTION_INVOCATION)) {
      node.value = substituteFunctionsInValue(node.value, pluginApi)
      return
    }

    // Find @media rules
    if (node.kind === 'rule') {
      if (
        node.selector[0] === '@' &&
        node.selector.startsWith('@media ') &&
        node.selector.includes(THEME_FUNCTION_INVOCATION)
      ) {
        node.selector = substituteFunctionsInValue(node.selector, pluginApi)
      }
    }
  })
}

export function substituteFunctionsInValue(value: string, pluginApi: PluginAPI): string {
  let ast = ValueParser.parse(value)
  walkValues(ast, (node, { replaceWith }) => {
    if (node.kind === 'function' && node.value === 'theme') {
      if (node.nodes.length < 1) {
        throw new Error(
          'Expected `theme()` function call to have a path. For example: `theme(colors.red.500)`.',
        )
      }

      let pathNode = node.nodes[0]
      if (pathNode.kind !== 'word') {
        throw new Error(
          `Expected \`theme()\` function to start with a path, but instead found ${pathNode.value}.`,
        )
      }
      let path = pathNode.value

      // For the theme function arguments, we require all separators to contain
      // comma (`,`), spaces alone should be merged into the previous word to
      // avoid splitting in this case:
      //
      // theme(colors.red.500 / 75%) theme(colors.red.500 / 75%, foo, bar)
      //
      // We only need to do this for the first node, as the fallback values are
      // passed through as-is.
      let skipUntilIndex = 1
      for (let i = skipUntilIndex; i < node.nodes.length; i++) {
        if (node.nodes[i].value.includes(',')) {
          break
        }
        path += node.nodes[i].value
        skipUntilIndex = i
      }

      path = eventuallyUnquote(path)
      let fallbackValues = node.nodes.slice(skipUntilIndex + 2)

      replaceWith(cssThemeFn(pluginApi, path, fallbackValues))
    }
  })

  return toValueCss(ast)
}

function cssThemeFn(
  pluginApi: PluginAPI,
  path: string,
  fallbackValues: ValueAstNode[],
): ValueAstNode[] {
  let modifier: string | null = null
  // Extract an eventual modifier from the path. e.g.:
  // - "colors.red.500 / 50%" -> "50%"
  // - "foo/bar/baz/50%"      -> "50%"
  let lastSlash = path.lastIndexOf('/')
  if (lastSlash !== -1) {
    modifier = path.slice(lastSlash + 1).trim()
    path = path.slice(0, lastSlash).trim()
  }

  let resolvedValue: string | null = null
  let themeValue = pluginApi.theme(path)

  if (Array.isArray(themeValue)) {
    // When a tuple is returned, return the first element
    resolvedValue = themeValue[0]
    // We otherwise only ignore string values here, objects (and namespace maps)
    // are treated as non-resolved values for the CSS `theme()` function.
  } else if (typeof themeValue === 'string') {
    resolvedValue = themeValue
  }

  // The plugin `theme()` function currently returns resolved values (so values
  // that are wrapped in `var()` and the CSS variable name). This `theme()`
  // function should, however, instead return the raw values. Raw values are
  // necessary because they might be used in positions where `var()` is not
  // supported like `@media (min-width: theme(--breakpoint-sm))`.
  //
  // Since the plugin `theme()` function operates on a materialized config
  // object provided by plugins, the values would already be read from the CSS
  // theme before we even get here (the config object is initialized together
  // with the plugins). Subsequently, we can only read resolved values here
  // unless we create a separate config object containing unresolved CSS values
  // that is only for use with the CSS `theme()` function.
  //
  // Since this is overkill, we instead introspect the string and try to unwrap
  // the `var()` call for now. This works because we always define a fallback
  // value that points to the raw CSS variable value.
  if (typeof resolvedValue === 'string' && resolvedValue.startsWith('var(')) {
    const firstComma = resolvedValue.indexOf(',')
    if (firstComma !== -1) {
      resolvedValue = resolvedValue.slice(firstComma + 1, -1).trim()
    }
  }

  if (!resolvedValue && fallbackValues.length > 0) {
    return fallbackValues
  }

  if (!resolvedValue) {
    throw new Error(
      `Could not resolve value for theme function: \`theme(${path}${modifier ? ` / ${modifier}` : ''})\`. Consider checking if the path is correct or provide a fallback value to silence this error.`,
    )
  }

  if (modifier) {
    resolvedValue = withAlpha(resolvedValue, modifier)
  }

  // We need to parse the values recursively since this can resolve with another
  // `theme()` function definition.
  return ValueParser.parse(resolvedValue)
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
