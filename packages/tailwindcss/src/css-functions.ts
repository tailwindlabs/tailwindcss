import { walk, type AstNode } from './ast'
import type { PluginAPI } from './plugin-api'
import * as ValueParser from './value-parser'
import { type ValueAstNode } from './value-parser'

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
  ValueParser.walk(ast, (node, { replaceWith }) => {
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
        skipUntilIndex = i + 1
      }

      path = eventuallyUnquote(path)
      let fallbackValues = node.nodes.slice(skipUntilIndex + 1)

      replaceWith(cssThemeFn(pluginApi, path, fallbackValues))
    }
  })

  return ValueParser.toCss(ast)
}

function cssThemeFn(
  pluginApi: PluginAPI,
  path: string,
  fallbackValues: ValueAstNode[],
): ValueAstNode[] {
  let resolvedValue: string | null = null
  let themeValue = pluginApi.theme(path)

  let isArray = Array.isArray(themeValue)
  if (isArray && themeValue.length === 2) {
    // When a tuple is returned, return the first element
    resolvedValue = themeValue[0]
  } else if (isArray) {
    // Arrays get serialized into a comma-separated lists
    resolvedValue = themeValue.join(', ')
  } else if (typeof themeValue === 'string') {
    // Otherwise only allow string values here, objects (and namespace maps)
    // are treated as non-resolved values for the CSS `theme()` function.
    resolvedValue = themeValue
  }

  if (!resolvedValue && fallbackValues.length > 0) {
    return fallbackValues
  }

  if (!resolvedValue) {
    throw new Error(
      `Could not resolve value for theme function: \`theme(${path})\`. Consider checking if the path is correct or provide a fallback value to silence this error.`,
    )
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
