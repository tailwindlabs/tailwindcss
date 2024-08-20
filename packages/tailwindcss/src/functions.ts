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
        // TODO: Update wording
        throw new Error('Expected theme() function to have at least one argument.')
      }

      let pathNode = node.nodes[0]
      if (pathNode.kind !== 'word') {
        // TODO: Update wording
        throw new Error('Expected the first argument of the theme() function to be a word.')
      }
      let path = pathNode.value

      // For the theme function arguments, we require all separators to contain comma (`,`), spaces
      // alone should be merged into the previous word to avoid splitting in this case:
      //
      // theme(colors.red.500 / 75%)
      // theme(colors.red.500 / 75%, foo, bar)
      //
      // We only need to do this for the first node
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
  let inputPath = path
  let modifier: string | null = null
  // Extract an eventual modifier from the path. e.g.:
  //
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
  } else if (typeof themeValue === 'string') {
    resolvedValue = themeValue
  }

  // TODO: Explain this
  if (typeof resolvedValue === 'string') {
    if (resolvedValue.startsWith('var(')) {
      const firstComma = resolvedValue.indexOf(',')
      if (firstComma !== -1) {
        resolvedValue = resolvedValue.slice(firstComma + 1, -1).trim()
      }
    } else {
      resolvedValue = resolvedValue
    }
  }

  if (!resolvedValue && fallbackValues.length > 0) {
    return fallbackValues
  }

  if (!resolvedValue) {
    // TODO: Update wording
    throw new Error(
      `Could not resolve value for theme function: \`theme(${path}${modifier ? ` / ${modifier}` : ''})\``,
    )
  }

  if (modifier) {
    resolvedValue = withAlpha(resolvedValue, modifier)
  }

  // We need to parse the value here since this can resolve with
  // another theme() function definition in case the @theme defines it as
  // theme()
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
