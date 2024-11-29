import { Features } from '.'
import { walk, type AstNode } from './ast'
import * as ValueParser from './value-parser'
import { type ValueAstNode } from './value-parser'

export const THEME_FUNCTION_INVOCATION = 'theme('

type ResolveThemeValue = (path: string) => string | undefined

export function substituteFunctions(ast: AstNode[], resolveThemeValue: ResolveThemeValue) {
  let features = Features.None
  walk(ast, (node) => {
    // Find all declaration values
    if (node.kind === 'declaration' && node.value?.includes(THEME_FUNCTION_INVOCATION)) {
      features |= Features.ThemeFunction
      node.value = substituteFunctionsInValue(node.value, resolveThemeValue)
      return
    }

    // Find at-rules rules
    if (node.kind === 'at-rule') {
      if (
        (node.name === '@media' ||
          node.name === '@custom-media' ||
          node.name === '@container' ||
          node.name === '@supports') &&
        node.params.includes(THEME_FUNCTION_INVOCATION)
      ) {
        features |= Features.ThemeFunction
        node.params = substituteFunctionsInValue(node.params, resolveThemeValue)
      }
    }
  })
  return features
}

export function substituteFunctionsInValue(
  value: string,
  resolveThemeValue: ResolveThemeValue,
): string {
  let ast = ValueParser.parse(value)
  ValueParser.walk(ast, (node, { replaceWith }) => {
    if (node.kind === 'function' && node.value === 'theme') {
      if (node.nodes.length < 1) {
        throw new Error(
          'Expected `theme()` function call to have a path. For example: `theme(--color-red-500)`.',
        )
      }

      // Ignore whitespace before the first argument
      if (node.nodes[0].kind === 'separator' && node.nodes[0].value.trim() === '') {
        node.nodes.shift()
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

      replaceWith(cssThemeFn(resolveThemeValue, path, fallbackValues))
    }
  })

  return ValueParser.toCss(ast)
}

function cssThemeFn(
  resolveThemeValue: ResolveThemeValue,
  path: string,
  fallbackValues: ValueAstNode[],
): ValueAstNode[] {
  let resolvedValue = resolveThemeValue(path)

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
