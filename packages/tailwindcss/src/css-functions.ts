import { Features } from '.'
import { walk, type AstNode } from './ast'
import type { DesignSystem } from './design-system'
import { segment } from './utils/segment'
import * as ValueParser from './value-parser'

const functions: Record<string, (designSystem: DesignSystem, ...args: string[]) => any> = {
  '--spacing': spacing,
  '--theme': theme,
  theme,
}

function spacing(designSystem: DesignSystem, value: string, ...rest: string[]) {
  if (!value) {
    throw new Error(`--spacing(…) requires a single value, but received none.`)
  }

  if (rest.length > 0) {
    throw new Error(
      `--spacing(…) only accepts a single value, but received ${rest.length + 1} values.`,
    )
  }

  let multiplier = designSystem.theme.resolve(null, ['--spacing'])
  if (!multiplier) {
    throw new Error('--spacing(…) depends on the `--spacing` theme value, but it was not found.')
  }

  return `calc(${multiplier} * ${value})`
}

function theme(designSystem: DesignSystem, path: string, ...fallback: string[]) {
  path = eventuallyUnquote(path)

  let resolvedValue = designSystem.resolveThemeValue(path)

  if (!resolvedValue && fallback.length > 0) {
    return fallback.join(', ')
  }

  if (!resolvedValue) {
    throw new Error(
      `Could not resolve value for theme function: \`theme(${path})\`. Consider checking if the path is correct or provide a fallback value to silence this error.`,
    )
  }

  return resolvedValue
}

export const THEME_FUNCTION_INVOCATION = new RegExp(
  Object.keys(functions)
    .map((x) => `${x}\\(`)
    .join('|'),
)

export function substituteFunctions(ast: AstNode[], designSystem: DesignSystem) {
  let features = Features.None
  walk(ast, (node) => {
    // Find all declaration values
    if (node.kind === 'declaration' && node.value && THEME_FUNCTION_INVOCATION.test(node.value)) {
      features |= Features.ThemeFunction
      node.value = substituteFunctionsInValue(node.value, designSystem)
      return
    }

    // Find at-rules rules
    if (node.kind === 'at-rule') {
      if (
        (node.name === '@media' ||
          node.name === '@custom-media' ||
          node.name === '@container' ||
          node.name === '@supports') &&
        THEME_FUNCTION_INVOCATION.test(node.params)
      ) {
        features |= Features.ThemeFunction
        node.params = substituteFunctionsInValue(node.params, designSystem)
      }
    }
  })
  return features
}

export function substituteFunctionsInValue(value: string, designSystem: DesignSystem): string {
  let ast = ValueParser.parse(value)
  ValueParser.walk(ast, (node, { replaceWith }) => {
    if (node.kind === 'function' && node.value in functions) {
      let args = segment(ValueParser.toCss(node.nodes).trim(), ',').map((x) => x.trim())
      let result = functions[node.value as keyof typeof functions](designSystem, ...args)
      return replaceWith(ValueParser.parse(result))
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
