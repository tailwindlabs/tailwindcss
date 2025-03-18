import { Features } from '.'
import { walk, type AstNode } from './ast'
import type { DesignSystem } from './design-system'
import { withAlpha } from './utilities'
import { segment } from './utils/segment'
import * as ValueParser from './value-parser'

const CSS_FUNCTIONS: Record<
  string,
  (designSystem: DesignSystem, source: AstNode, ...args: string[]) => string
> = {
  '--alpha': alpha,
  '--spacing': spacing,
  '--theme': theme,
  theme: legacyTheme,
}

function alpha(
  _designSystem: DesignSystem,
  _source: AstNode,
  value: string,
  ...rest: string[]
): string {
  let [color, alpha] = segment(value, '/').map((v) => v.trim())

  if (!color || !alpha) {
    throw new Error(
      `The --alpha(…) function requires a color and an alpha value, e.g.: \`--alpha(${color || 'var(--my-color)'} / ${alpha || '50%'})\``,
    )
  }

  if (rest.length > 0) {
    throw new Error(
      `The --alpha(…) function only accepts one argument, e.g.: \`--alpha(${color || 'var(--my-color)'} / ${alpha || '50%'})\``,
    )
  }

  return withAlpha(color, alpha)
}

function spacing(
  designSystem: DesignSystem,
  _source: AstNode,
  value: string,
  ...rest: string[]
): string {
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

function theme(
  designSystem: DesignSystem,
  source: AstNode,
  path: string,
  ...fallback: string[]
): string {
  if (!path.startsWith('--')) {
    throw new Error(`The --theme(…) function can only be used with CSS variables from your theme.`)
  }

  let inline = false

  // Handle `--theme(… inline)` to force inline resolution
  if (path.endsWith(' inline')) {
    inline = true
    path = path.slice(0, -7)
  }

  // If the `--theme(…)` function is used within an at-rule (e.g. `@media (width >= --theme(…)))`,
  // we have to always inline the result since CSS does not support CSS variables in these positions
  if (source.kind === 'at-rule') {
    inline = true
  }

  let resolvedValue = designSystem.resolveThemeValue(path, inline)

  if (!resolvedValue) {
    if (fallback.length > 0) return fallback.join(', ')
    throw new Error(
      `Could not resolve value for theme function: \`theme(${path})\`. Consider checking if the variable name is correct or provide a fallback value to silence this error.`,
    )
  }

  if (fallback.length === 0) {
    return resolvedValue
  }

  let joinedFallback = fallback.join(', ')
  if (joinedFallback === 'initial') return resolvedValue

  // When the resolved value returns `initial`, resolve with the the fallback value
  if (resolvedValue === 'initial') return joinedFallback

  // Inject the fallback of a `--theme(…)` function into the fallback of a referenced `--theme(…)`
  // function or `var(…)` declaration. If the referenced function already defines a fallback, we use
  // a potential fallback value of `initial` in the referenced function to determine if we should
  // inject the fallback value of the caller. If that's not the case, we keep the fallback as-is
  // (this is needed for theme variables in reference-mode).
  if (
    resolvedValue.startsWith('var(') ||
    resolvedValue.startsWith('theme(') ||
    resolvedValue.startsWith('--theme(')
  ) {
    let valueAst = ValueParser.parse(resolvedValue)
    injectFallbackForInitialFallback(valueAst, joinedFallback)
    return ValueParser.toCss(valueAst)
  }

  return resolvedValue
}

function legacyTheme(
  designSystem: DesignSystem,
  _source: AstNode,
  path: string,
  ...fallback: string[]
): string {
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
  Object.keys(CSS_FUNCTIONS)
    .map((x) => `${x}\\(`)
    .join('|'),
)

export function substituteFunctions(ast: AstNode[], designSystem: DesignSystem) {
  let features = Features.None
  walk(ast, (node) => {
    // Find all declaration values
    if (node.kind === 'declaration' && node.value && THEME_FUNCTION_INVOCATION.test(node.value)) {
      features |= Features.ThemeFunction
      node.value = substituteFunctionsInValue(node.value, node, designSystem)
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
        node.params = substituteFunctionsInValue(node.params, node, designSystem)
      }
    }
  })
  return features
}

export function substituteFunctionsInValue(
  value: string,
  source: AstNode,
  designSystem: DesignSystem,
): string {
  let ast = ValueParser.parse(value)
  ValueParser.walk(ast, (node, { replaceWith }) => {
    if (node.kind === 'function' && node.value in CSS_FUNCTIONS) {
      let args = segment(ValueParser.toCss(node.nodes).trim(), ',').map((x) => x.trim())
      let result = CSS_FUNCTIONS[node.value as keyof typeof CSS_FUNCTIONS](
        designSystem,
        source,
        ...args,
      )
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

function injectFallbackForInitialFallback(ast: ValueParser.ValueAstNode[], fallback: string): void {
  ValueParser.walk(ast, (node) => {
    if (node.kind !== 'function') return
    if (node.value !== 'var' && node.value !== 'theme' && node.value !== '--theme') return

    if (node.nodes.length === 1) {
      node.nodes.push({
        kind: 'word',
        value: `, ${fallback}`,
      })
    } else {
      let lastNode = node.nodes[node.nodes.length - 1]
      if (lastNode.kind === 'word' && lastNode.value === 'initial') {
        lastNode.value = fallback
      }
    }
  })
}
