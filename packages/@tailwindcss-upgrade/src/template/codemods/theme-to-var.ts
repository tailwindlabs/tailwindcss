import type { Config } from 'tailwindcss'
import {
  parseCandidate,
  type Candidate,
  type CandidateModifier,
  type Variant,
} from '../../../../tailwindcss/src/candidate'
import { keyPathToCssProperty } from '../../../../tailwindcss/src/compat/apply-config-to-theme'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { segment } from '../../../../tailwindcss/src/utils/segment'
import { toKeyPath } from '../../../../tailwindcss/src/utils/to-key-path'
import * as ValueParser from '../../../../tailwindcss/src/value-parser'
import { printCandidate } from '../candidates'

export function themeToVar(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  function convertBasic(input: string, modernizeThemeOnly = false) {
    return substituteFunctionsInValue(input, (path, fallback) => {
      let parts = segment(path, '/').map((part) => part.trim())

      if (
        // The path contains a `/`, which means that there is a modifier such as
        // `theme(colors.red.500/50%)`. We can't convert this to a CSS variable.
        parts.length > 1 ||
        // In some scenarios (variants), we can't migrate to `var(…)` if it ends
        // up in the `@media (…)` part. To be safe, let's just modernize the
        // `theme(…)`
        modernizeThemeOnly
      ) {
        let path = parts.shift()!

        // Convert to modern `theme(…)` syntax using CSS variable syntax if we
        // can.
        let variable = `--${keyPathToCssProperty(toKeyPath(path))}` as const

        if (!designSystem.theme.get([variable])) {
          return null
        }

        let modifier = parts.length > 0 ? `/${parts.join('/')}` : ''

        return fallback
          ? `theme(${variable}${modifier}, ${fallback})`
          : `theme(${variable}${modifier})`
      }

      // Convert to `var(…)`
      let variable = `--${keyPathToCssProperty(toKeyPath(path))}` as const
      if (!designSystem.theme.get([variable])) return null

      return fallback ? `var(${variable}, ${fallback})` : `var(${variable})`
    })
  }

  function convert(input: string, containsModifier = false) {
    if (containsModifier) return [convertBasic(input), null] as const

    let modifiers: CandidateModifier[] = []
    let result = substituteFunctionsInValue(input, (path, fallback) => {
      let parts = segment(path, '/').map((part) => part.trim())

      // The path contains a `/`, which means that there is a modifier such as
      // `theme(colors.red.500/50%)`.
      //
      // Currently, we are assuming that this is only being used for colors,
      // which means that we can typically convert them to a modifier on the
      // candidate itself.
      if (parts.length === 2) {
        let [pathPart, modifierPart] = parts

        // 50% -> /50
        if (/^\d+%$/.test(modifierPart)) {
          modifiers.push({ kind: 'named', value: modifierPart.slice(0, -1) })
        }

        // .12 -> /12
        // .12345 -> /[12.345]
        else if (/^0?\.\d+$/.test(modifierPart)) {
          let value = Number(modifierPart) * 100
          modifiers.push({
            kind: Number.isInteger(value) ? 'named' : 'arbitrary',
            value: value.toString(),
          })
        }

        // Anything else becomes arbitrary
        else {
          modifiers.push({ kind: 'arbitrary', value: modifierPart })
        }

        // Update path to be the first part
        path = pathPart
      }

      let variable = `--${keyPathToCssProperty(toKeyPath(path))}` as const
      if (!designSystem.theme.get([variable])) return null

      return fallback ? `var(${variable}, ${fallback})` : `var(${variable})`
    })

    // Multiple modifiers which means that there are multiple `theme(…/…)`
    // values. In this case, we can't convert the modifier to a candidate
    // modifier. Try to convert each `theme(…)` call to the modern syntax.
    if (modifiers.length > 1) return [convertBasic(input), null] as const

    return [result, modifiers[0]] as const
  }

  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    let clone = structuredClone(candidate)
    let changed = false

    if (clone.kind === 'arbitrary') {
      let [newValue, modifier] = convert(clone.value, clone.modifier !== null)
      if (newValue !== clone.value) {
        changed = true
        clone.value = newValue

        if (modifier !== null) {
          clone.modifier = modifier
        }
      }
    } else if (clone.kind === 'functional' && clone.value?.kind === 'arbitrary') {
      let [newValue, modifier] = convert(clone.value.value, clone.modifier !== null)
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
        let newValue = convertBasic(variant.selector, true)
        if (newValue !== variant.selector) {
          changed = true
          variant.selector = newValue
        }
      } else if (variant.kind === 'functional' && variant.value?.kind === 'arbitrary') {
        let newValue = convertBasic(variant.value.value, true)
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

function substituteFunctionsInValue(
  value: string,
  handle: (value: string, fallback?: string) => string | null,
) {
  let ast = ValueParser.parse(value)
  ValueParser.walk(ast, (node, { replaceWith }) => {
    if (node.kind === 'function' && node.value === 'theme') {
      if (node.nodes.length < 1) return

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
