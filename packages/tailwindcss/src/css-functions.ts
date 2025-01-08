import { Features } from '.'
import { walk, type AstNode } from './ast'
import type { DesignSystem } from './design-system'
import { withAlpha } from './utilities'
import { segment } from './utils/segment'
import * as ValueParser from './value-parser'

const functions: Record<string, (designSystem: DesignSystem, ...args: string[]) => any> = {
  '--alpha': alpha,
  '--spacing': spacing,
  '--theme': theme,
  theme,
}

function alpha(_designSystem: DesignSystem, value: string, alpha: string, ...rest: string[]) {
  if (!value || !alpha) {
    throw new Error(
      `The --alpha(…) function requires two arguments, e.g.: \`--alpha(${value || 'var(--my-color)'}, ${alpha || '50%'})\``,
    )
  }

  if (rest.length > 0) {
    throw new Error(
      `The --alpha(…) function only accepts two arguments, e.g.: \`--alpha(${value || 'var(--my-color)'}, ${alpha || '50%'})\``,
    )
  }

  return withAlpha(value, alpha)
}

function spacing(designSystem: DesignSystem, value: string, ...rest: string[]) {
  if (!value) {
    throw new Error(`The --spacing(…) function requires an argument, but received none.`)
  }

  if (rest.length > 0) {
    throw new Error(
      `The --spacing(…) function only accepts a single argument, but received ${rest.length + 1}.`,
    )
  }

  let multiplier = designSystem.theme.resolve(null, ['--spacing'])
  if (!multiplier) {
    throw new Error(
      'The --spacing(…) function requires that the `--spacing` theme variable exists, but it was not found.',
    )
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
