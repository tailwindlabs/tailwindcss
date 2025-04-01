import {
  parseCandidate,
  type Candidate,
  type CandidateModifier,
  type Variant,
} from '../../../../tailwindcss/src/candidate'
import { keyPathToCssProperty } from '../../../../tailwindcss/src/compat/apply-config-to-theme'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { isValidSpacingMultiplier } from '../../../../tailwindcss/src/utils/infer-data-type'
import { segment } from '../../../../tailwindcss/src/utils/segment'
import { toKeyPath } from '../../../../tailwindcss/src/utils/to-key-path'
import * as ValueParser from '../../../../tailwindcss/src/value-parser'
import { printCandidate } from './candidates'

export const enum Convert {
  All = 0,
  MigrateModifier = 1 << 0,
  MigrateThemeOnly = 1 << 1,
}

export function migrateThemeToVar(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  let convert = createConverter(designSystem)

  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    let clone = structuredClone(candidate)
    let changed = false

    if (clone.kind === 'arbitrary') {
      let [newValue, modifier] = convert(
        clone.value,
        clone.modifier === null ? Convert.MigrateModifier : Convert.All,
      )
      if (newValue !== clone.value) {
        changed = true
        clone.value = newValue

        if (modifier !== null) {
          clone.modifier = modifier
        }
      }
    } else if (clone.kind === 'functional' && clone.value?.kind === 'arbitrary') {
      let [newValue, modifier] = convert(
        clone.value.value,
        clone.modifier === null ? Convert.MigrateModifier : Convert.All,
      )
      if (newValue !== clone.value.value) {
        changed = true
        clone.value.value = newValue

        if (modifier !== null) {
          clone.modifier = modifier
        }
      }
    }

    // Handle variants
    for (let variant of variants(clone)) {
      if (variant.kind === 'arbitrary') {
        let [newValue] = convert(variant.selector, Convert.MigrateThemeOnly)
        if (newValue !== variant.selector) {
          changed = true
          variant.selector = newValue
        }
      } else if (variant.kind === 'functional' && variant.value?.kind === 'arbitrary') {
        let [newValue] = convert(variant.value.value, Convert.MigrateThemeOnly)
        if (newValue !== variant.value.value) {
          changed = true
          variant.value.value = newValue
        }
      }
    }

    return changed ? printCandidate(designSystem, clone) : rawCandidate
  }

  return rawCandidate
}

export function createConverter(designSystem: DesignSystem, { prettyPrint = false } = {}) {
  function convert(input: string, options = Convert.All): [string, CandidateModifier | null] {
    let ast = ValueParser.parse(input)

    // In some scenarios (e.g.: variants), we can't migrate to `var(…)` if it
    // ends up in the `@media (…)` part. In this case we only have to migrate to
    // the new `theme(…)` notation.
    if (options & Convert.MigrateThemeOnly) {
      return [substituteFunctionsInValue(ast, toTheme), null]
    }

    let themeUsageCount = 0
    let themeModifierCount = 0

    // Analyze AST
    ValueParser.walk(ast, (node) => {
      if (node.kind !== 'function') return
      if (node.value !== 'theme') return

      // We are only interested in the `theme` function
      themeUsageCount += 1

      // Figure out if a modifier is used
      ValueParser.walk(node.nodes, (child) => {
        // If we see a `,`, it means that we have a fallback value
        if (child.kind === 'separator' && child.value.includes(',')) {
          return ValueParser.ValueWalkAction.Stop
        }

        // If we see a `/`, we have a modifier
        else if (child.kind === 'separator' && child.value.trim() === '/') {
          themeModifierCount += 1
          return ValueParser.ValueWalkAction.Stop
        }

        return ValueParser.ValueWalkAction.Skip
      })
    })

    // No `theme(…)` calls, nothing to do
    if (themeUsageCount === 0) {
      return [input, null]
    }

    // No `theme(…)` with modifiers, we can migrate to `var(…)`
    if (themeModifierCount === 0) {
      return [substituteFunctionsInValue(ast, toVar), null]
    }

    // Multiple modifiers which means that there are multiple `theme(…/…)`
    // values. In this case, we can't convert the modifier to a candidate
    // modifier.
    //
    // We also can't migrate to `var(…)` because that would lose the modifier.
    //
    // Try to convert each `theme(…)` call to the modern syntax.
    if (themeModifierCount > 1) {
      return [substituteFunctionsInValue(ast, toTheme), null]
    }

    // Only a single `theme(…)` with a modifier left, that modifier will be
    // migrated to a candidate modifier.
    let modifier: CandidateModifier | null = null
    let result = substituteFunctionsInValue(ast, (path, fallback) => {
      let parts = segment(path, '/').map((part) => part.trim())

      // Multiple `/` separators, which makes this an invalid path
      if (parts.length > 2) return null

      // The path contains a `/`, which means that there is a modifier such as
      // `theme(colors.red.500/50%)`.
      //
      // Currently, we are assuming that this is only being used for colors,
      // which means that we can typically convert them to a modifier on the
      // candidate itself.
      //
      // If there is more than one node in the AST though, `theme(…)` must not
      // be the whole value so it's not safe to use a modifier instead.
      //
      // E.g.: `inset 0px 1px theme(colors.red.500/50%)` is a shadow, not a color.
      if (ast.length === 1 && parts.length === 2 && options & Convert.MigrateModifier) {
        let [pathPart, modifierPart] = parts

        // 50% -> /50
        if (/^\d+%$/.test(modifierPart)) {
          modifier = { kind: 'named', value: modifierPart.slice(0, -1) }
        }

        // .12 -> /12
        // .12345 -> /[12.345]
        else if (/^0?\.\d+$/.test(modifierPart)) {
          let value = Number(modifierPart) * 100
          modifier = {
            kind: Number.isInteger(value) ? 'named' : 'arbitrary',
            value: value.toString(),
          }
        }

        // Anything else becomes arbitrary
        else {
          modifier = { kind: 'arbitrary', value: modifierPart }
        }

        // Update path to be the first part
        path = pathPart
      }

      return toVar(path, fallback) || toTheme(path, fallback)
    })

    return [result, modifier]
  }

  function pathToVariableName(path: string) {
    let variable = `--${keyPathToCssProperty(toKeyPath(path))}` as const
    if (!designSystem.theme.get([variable])) return null

    return variable
  }

  function toVar(path: string, fallback?: string) {
    let variable = pathToVariableName(path)
    if (variable) return fallback ? `var(${variable}, ${fallback})` : `var(${variable})`

    let keyPath = toKeyPath(path)
    if (keyPath[0] === 'spacing' && designSystem.theme.get(['--spacing'])) {
      let multiplier = keyPath[1]
      if (!isValidSpacingMultiplier(multiplier)) return null

      return `--spacing(${multiplier})`
    }

    return null
  }

  function toTheme(path: string, fallback?: string) {
    let parts = segment(path, '/').map((part) => part.trim())
    path = parts.shift()!

    let variable = pathToVariableName(path)
    if (!variable) return null

    let modifier =
      parts.length > 0 ? (prettyPrint ? ` / ${parts.join(' / ')}` : `/${parts.join('/')}`) : ''
    return fallback
      ? `--theme(${variable}${modifier}, ${fallback})`
      : `--theme(${variable}${modifier})`
  }

  return convert
}

function substituteFunctionsInValue(
  ast: ValueParser.ValueAstNode[],
  handle: (value: string, fallback?: string) => string | null,
) {
  ValueParser.walk(ast, (node, { parent, replaceWith }) => {
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

      if (parent) {
        let idx = parent.nodes.indexOf(node) - 1
        while (idx !== -1) {
          let previous = parent.nodes[idx]
          // Skip the space separator
          if (previous.kind === 'separator' && previous.value.trim() === '') {
            idx -= 1
            continue
          }

          // If the previous node is a word and contains an operator, we need to
          // wrap the replacement in parentheses to make the output less
          // ambiguous.
          //
          // Input:
          // - `calc(100dvh-theme(spacing.2))`
          //
          // Output:
          // - `calc(100dvh-(--spacing(2)))`
          //
          // Not:
          // -`calc(100dvh---spacing(2))`
          //
          if (/^[-+*/]$/.test(previous.value.trim())) {
            replacement = `(${replacement})`
          }

          break
        }
      }

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

function* variants(candidate: Candidate) {
  function* inner(variant: Variant): Iterable<Variant> {
    yield variant
    if (variant.kind === 'compound') {
      yield* inner(variant.variant)
    }
  }

  for (let variant of candidate.variants) {
    yield* inner(variant)
  }
}
