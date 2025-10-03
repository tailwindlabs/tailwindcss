import {
  printModifier,
  type Candidate,
  type CandidateModifier,
  type NamedUtilityValue,
  type Variant,
} from './candidate'
import { keyPathToCssProperty } from './compat/apply-config-to-theme'
import * as SelectorParser from './compat/selector-parser'
import type { DesignSystem } from './design-system'
import {
  computeUtilitySignature,
  computeVariantSignature,
  preComputedUtilities,
  preComputedVariants,
} from './signatures'
import type { Writable } from './types'
import { DefaultMap } from './utils/default-map'
import { dimensions } from './utils/dimensions'
import { isPositiveInteger, isValidSpacingMultiplier } from './utils/infer-data-type'
import { replaceObject } from './utils/replace-object'
import { segment } from './utils/segment'
import { toKeyPath } from './utils/to-key-path'
import * as ValueParser from './value-parser'

export function canonicalizeCandidates(ds: DesignSystem, candidates: string[]): string[] {
  let result = new Set<string>()
  for (let candidate of candidates) {
    result.add(canonicalizeCandidateCache.get(ds).get(candidate))
  }
  return Array.from(result)
}

const canonicalizeCandidateCache = new DefaultMap((ds: DesignSystem) => {
  return new DefaultMap((candidate: string) => {
    let result = candidate
    for (let fn of CANONICALIZATIONS) {
      let newResult = fn(ds, result)
      if (newResult !== result) {
        result = newResult
      }
    }
    return result
  })
})

const CANONICALIZATIONS = [
  bgGradientToLinear,
  themeToVar,
  arbitraryUtilities,
  bareValueUtilities,
  deprecatedUtilities,
  dropUnnecessaryDataTypes,
  arbitraryValueToBareValue,
  modernizeArbitraryValues,
  arbitraryVariants,
  optimizeModifier,
  print,
]

function print(designSystem: DesignSystem, rawCandidate: string): string {
  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    return designSystem.printCandidate(candidate)
  }
  return rawCandidate
}

// ----

const DIRECTIONS = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
function bgGradientToLinear(designSystem: DesignSystem, rawCandidate: string): string {
  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (candidate.kind === 'static' && candidate.root.startsWith('bg-gradient-to-')) {
      let direction = candidate.root.slice(15)

      if (!DIRECTIONS.includes(direction)) {
        continue
      }

      return designSystem.printCandidate({
        ...candidate,
        root: `bg-linear-to-${direction}`,
      })
    }
  }
  return rawCandidate
}

// ----

const enum Convert {
  All = 0,
  MigrateModifier = 1 << 0,
  MigrateThemeOnly = 1 << 1,
}

function themeToVar(designSystem: DesignSystem, rawCandidate: string): string {
  let convert = converterCache.get(designSystem)

  for (let candidate of parseCandidate(designSystem, rawCandidate)) {
    let clone = structuredClone(candidate) as Writable<typeof candidate>
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
    for (let [variant] of walkVariants(clone)) {
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

    return changed ? designSystem.printCandidate(clone) : rawCandidate
  }

  return rawCandidate
}

const converterCache = new DefaultMap((ds: DesignSystem) => {
  return createConverter(ds)

  function createConverter(designSystem: DesignSystem) {
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

    function pathToVariableName(path: string, shouldPrefix = true) {
      let variable = `--${keyPathToCssProperty(toKeyPath(path))}` as const
      if (!designSystem.theme.get([variable])) return null

      if (shouldPrefix && designSystem.theme.prefix) {
        return `--${designSystem.theme.prefix}-${variable.slice(2)}`
      }

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

      let variable = pathToVariableName(path, false)
      if (!variable) return null

      let modifier = parts.length > 0 ? `/${parts.join('/')}` : ''
      return fallback
        ? `--theme(${variable}${modifier}, ${fallback})`
        : `--theme(${variable}${modifier})`
    }

    return convert
  }
})

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

// ----

function* walkVariants(candidate: Candidate) {
  function* inner(
    variant: Variant,
    parent: Extract<Variant, { kind: 'compound' }> | null = null,
  ): Iterable<[Variant, Extract<Variant, { kind: 'compound' }> | null]> {
    yield [variant, parent]

    if (variant.kind === 'compound') {
      yield* inner(variant.variant, variant)
    }
  }

  for (let variant of candidate.variants) {
    yield* inner(variant, null)
  }
}

function baseCandidate<T extends Candidate>(candidate: T) {
  let base = structuredClone(candidate)

  base.important = false
  base.variants = []

  return base
}

function parseCandidate(designSystem: DesignSystem, input: string) {
  return designSystem.parseCandidate(
    designSystem.theme.prefix && !input.startsWith(`${designSystem.theme.prefix}:`)
      ? `${designSystem.theme.prefix}:${input}`
      : input,
  )
}

function printUnprefixedCandidate(designSystem: DesignSystem, candidate: Candidate) {
  let candidateString = designSystem.printCandidate(candidate)

  return designSystem.theme.prefix && candidateString.startsWith(`${designSystem.theme.prefix}:`)
    ? candidateString.slice(designSystem.theme.prefix.length + 1)
    : candidateString
}

// ----

const baseReplacementsCache = new DefaultMap<DesignSystem, Map<string, Candidate>>(
  () => new Map<string, Candidate>(),
)

const spacing = new DefaultMap<DesignSystem, DefaultMap<string, number | null> | null>((ds) => {
  let spacingMultiplier = ds.resolveThemeValue('--spacing')
  if (spacingMultiplier === undefined) return null

  let parsed = dimensions.get(spacingMultiplier)
  if (!parsed) return null

  let [value, unit] = parsed

  return new DefaultMap<string, number | null>((input) => {
    let parsed = dimensions.get(input)
    if (!parsed) return null

    let [myValue, myUnit] = parsed
    if (myUnit !== unit) return null

    return myValue / value
  })
})

function arbitraryUtilities(designSystem: DesignSystem, rawCandidate: string): string {
  let utilities = preComputedUtilities.get(designSystem)
  let signatures = computeUtilitySignature.get(designSystem)

  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    // We are only interested in arbitrary properties and arbitrary values
    if (
      // Arbitrary property
      readonlyCandidate.kind !== 'arbitrary' &&
      // Arbitrary value
      !(readonlyCandidate.kind === 'functional' && readonlyCandidate.value?.kind === 'arbitrary')
    ) {
      continue
    }

    // The below logic makes use of mutation. Since candidates in the
    // DesignSystem are cached, we can't mutate them directly.
    let candidate = structuredClone(readonlyCandidate) as Writable<typeof readonlyCandidate>

    // Create a basic stripped candidate without variants or important flag. We
    // will re-add those later but they are irrelevant for what we are trying to
    // do here (and will increase cache hits because we only have to deal with
    // the base utility, nothing more).
    let targetCandidate = baseCandidate(candidate)

    let targetCandidateString = designSystem.printCandidate(targetCandidate)
    if (baseReplacementsCache.get(designSystem).has(targetCandidateString)) {
      let target = structuredClone(
        baseReplacementsCache.get(designSystem).get(targetCandidateString)!,
      )
      // Re-add the variants and important flag from the original candidate
      target.variants = candidate.variants
      target.important = candidate.important

      return designSystem.printCandidate(target)
    }

    // Compute the signature for the target candidate
    let targetSignature = signatures.get(targetCandidateString)
    if (typeof targetSignature !== 'string') continue

    // Try a few options to find a suitable replacement utility
    for (let replacementCandidate of tryReplacements(targetSignature, targetCandidate)) {
      let replacementString = designSystem.printCandidate(replacementCandidate)
      let replacementSignature = signatures.get(replacementString)
      if (replacementSignature !== targetSignature) {
        continue
      }

      // Ensure that if CSS variables were used, that they are still used
      if (!allVariablesAreUsed(designSystem, candidate, replacementCandidate)) {
        continue
      }

      replacementCandidate = structuredClone(replacementCandidate)

      // Cache the result so we can re-use this work later
      baseReplacementsCache.get(designSystem).set(targetCandidateString, replacementCandidate)

      // Re-add the variants and important flag from the original candidate
      replacementCandidate.variants = candidate.variants
      replacementCandidate.important = candidate.important

      // Update the candidate with the new value
      Object.assign(candidate, replacementCandidate)

      // We will re-print the candidate to get the migrated candidate out
      return designSystem.printCandidate(candidate)
    }
  }

  return rawCandidate

  function* tryReplacements(
    targetSignature: string,
    candidate: Extract<Candidate, { kind: 'functional' | 'arbitrary' }>,
  ): Generator<Candidate> {
    // Find a corresponding utility for the same signature
    let replacements = utilities.get(targetSignature)

    // Multiple utilities can map to the same signature. Not sure how to migrate
    // this one so let's just skip it for now.
    //
    // TODO: Do we just migrate to the first one?
    if (replacements.length > 1) return

    // If we didn't find any replacement utilities, let's try to strip the
    // modifier and find a replacement then. If we do, we can try to re-add the
    // modifier later and verify if we have a valid migration.
    //
    // This is necessary because `text-red-500/50` will not be pre-computed,
    // only `text-red-500` will.
    if (replacements.length === 0 && candidate.modifier) {
      let candidateWithoutModifier = { ...candidate, modifier: null }
      let targetSignatureWithoutModifier = signatures.get(
        designSystem.printCandidate(candidateWithoutModifier),
      )
      if (typeof targetSignatureWithoutModifier === 'string') {
        for (let replacementCandidate of tryReplacements(
          targetSignatureWithoutModifier,
          candidateWithoutModifier,
        )) {
          yield Object.assign({}, replacementCandidate, { modifier: candidate.modifier })
        }
      }
    }

    // If only a single utility maps to the signature, we can use that as the
    // replacement.
    if (replacements.length === 1) {
      for (let replacementCandidate of parseCandidate(designSystem, replacements[0])) {
        yield replacementCandidate
      }
    }

    // Find a corresponding functional utility for the same signature
    else if (replacements.length === 0) {
      // An arbitrary property will only set a single property, we can use that
      // to find functional utilities that also set this property.
      let value =
        candidate.kind === 'arbitrary' ? candidate.value : (candidate.value?.value ?? null)
      if (value === null) return

      let spacingMultiplier = spacing.get(designSystem)?.get(value) ?? null
      let rootPrefix = ''
      if (spacingMultiplier !== null && spacingMultiplier < 0) {
        rootPrefix = '-'
        spacingMultiplier = Math.abs(spacingMultiplier)
      }

      for (let root of Array.from(designSystem.utilities.keys('functional')).sort(
        // Sort negative roots after positive roots so that we can try
        // `mt-*` before `-mt-*`. This is especially useful in situations where
        // `-mt-[0px]` can be translated to `mt-[0px]`.
        (a, z) => Number(a[0] === '-') - Number(z[0] === '-'),
      )) {
        if (rootPrefix) root = `${rootPrefix}${root}`

        // Try as bare value
        for (let replacementCandidate of parseCandidate(designSystem, `${root}-${value}`)) {
          yield replacementCandidate
        }

        // Try as bare value with modifier
        if (candidate.modifier) {
          for (let replacementCandidate of parseCandidate(
            designSystem,
            `${root}-${value}${candidate.modifier}`,
          )) {
            yield replacementCandidate
          }
        }

        // Try bare value based on the `--spacing` value. E.g.:
        //
        // - `w-[64rem]` → `w-256`
        if (spacingMultiplier !== null) {
          for (let replacementCandidate of parseCandidate(
            designSystem,
            `${root}-${spacingMultiplier}`,
          )) {
            yield replacementCandidate
          }

          // Try bare value based on the `--spacing` value, but with a modifier
          if (candidate.modifier) {
            for (let replacementCandidate of parseCandidate(
              designSystem,
              `${root}-${spacingMultiplier}${printModifier(candidate.modifier)}`,
            )) {
              yield replacementCandidate
            }
          }
        }

        // Try as arbitrary value
        for (let replacementCandidate of parseCandidate(designSystem, `${root}-[${value}]`)) {
          yield replacementCandidate
        }

        // Try as arbitrary value with modifier
        if (candidate.modifier) {
          for (let replacementCandidate of parseCandidate(
            designSystem,
            `${root}-[${value}]${printModifier(candidate.modifier)}`,
          )) {
            yield replacementCandidate
          }
        }
      }
    }
  }
}

// Let's make sure that all variables used in the value are also all used in the
// found replacement. If not, then we are dealing with a different namespace or
// we could lose functionality in case the variable was changed higher up in the
// DOM tree.
function allVariablesAreUsed(
  designSystem: DesignSystem,
  candidate: Candidate,
  replacement: Candidate,
) {
  let value: string | null = null

  // Functional utility with arbitrary value and variables
  if (
    candidate.kind === 'functional' &&
    candidate.value?.kind === 'arbitrary' &&
    candidate.value.value.includes('var(--')
  ) {
    value = candidate.value.value
  }

  // Arbitrary property with variables
  else if (candidate.kind === 'arbitrary' && candidate.value.includes('var(--')) {
    value = candidate.value
  }

  // No variables in the value, so this is a safe migration
  if (value === null) {
    return true
  }

  let replacementAsCss = designSystem
    .candidatesToCss([designSystem.printCandidate(replacement)])
    .join('\n')

  let isSafeMigration = true
  ValueParser.walk(ValueParser.parse(value), (node) => {
    if (node.kind === 'function' && node.value === 'var') {
      let variable = node.nodes[0].value
      let r = new RegExp(`var\\(${variable}[,)]\\s*`, 'g')
      if (
        // We need to check if the variable is used in the replacement
        !r.test(replacementAsCss) ||
        // The value cannot be set to a different value in the
        // replacement because that would make it an unsafe migration
        replacementAsCss.includes(`${variable}:`)
      ) {
        isSafeMigration = false
        return ValueParser.ValueWalkAction.Stop
      }
    }
  })

  return isSafeMigration
}

// ----

function bareValueUtilities(designSystem: DesignSystem, rawCandidate: string): string {
  let utilities = preComputedUtilities.get(designSystem)
  let signatures = computeUtilitySignature.get(designSystem)

  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    // We are only interested in bare value utilities
    if (readonlyCandidate.kind !== 'functional' || readonlyCandidate.value?.kind !== 'named') {
      continue
    }

    // The below logic makes use of mutation. Since candidates in the
    // DesignSystem are cached, we can't mutate them directly.
    let candidate = structuredClone(readonlyCandidate) as Writable<typeof readonlyCandidate>

    // Create a basic stripped candidate without variants or important flag. We
    // will re-add those later but they are irrelevant for what we are trying to
    // do here (and will increase cache hits because we only have to deal with
    // the base utility, nothing more).
    let targetCandidate = baseCandidate(candidate)

    let targetCandidateString = designSystem.printCandidate(targetCandidate)
    if (baseReplacementsCache.get(designSystem).has(targetCandidateString)) {
      let target = structuredClone(
        baseReplacementsCache.get(designSystem).get(targetCandidateString)!,
      )
      // Re-add the variants and important flag from the original candidate
      target.variants = candidate.variants
      target.important = candidate.important

      return designSystem.printCandidate(target)
    }

    // Compute the signature for the target candidate
    let targetSignature = signatures.get(targetCandidateString)
    if (typeof targetSignature !== 'string') continue

    // Try a few options to find a suitable replacement utility
    for (let replacementCandidate of tryReplacements(targetSignature, targetCandidate)) {
      let replacementString = designSystem.printCandidate(replacementCandidate)
      let replacementSignature = signatures.get(replacementString)
      if (replacementSignature !== targetSignature) {
        continue
      }

      replacementCandidate = structuredClone(replacementCandidate)

      // Cache the result so we can re-use this work later
      baseReplacementsCache.get(designSystem).set(targetCandidateString, replacementCandidate)

      // Re-add the variants and important flag from the original candidate
      replacementCandidate.variants = candidate.variants
      replacementCandidate.important = candidate.important

      // Update the candidate with the new value
      Object.assign(candidate, replacementCandidate)

      // We will re-print the candidate to get the migrated candidate out
      return designSystem.printCandidate(candidate)
    }
  }

  return rawCandidate

  function* tryReplacements(
    targetSignature: string,
    candidate: Extract<Candidate, { kind: 'functional' }>,
  ): Generator<Candidate> {
    // Find a corresponding utility for the same signature
    let replacements = utilities.get(targetSignature)

    // Multiple utilities can map to the same signature. Not sure how to migrate
    // this one so let's just skip it for now.
    //
    // TODO: Do we just migrate to the first one?
    if (replacements.length > 1) return

    // If we didn't find any replacement utilities, let's try to strip the
    // modifier and find a replacement then. If we do, we can try to re-add the
    // modifier later and verify if we have a valid migration.
    //
    // This is necessary because `text-red-500/50` will not be pre-computed,
    // only `text-red-500` will.
    if (replacements.length === 0 && candidate.modifier) {
      let candidateWithoutModifier = { ...candidate, modifier: null }
      let targetSignatureWithoutModifier = signatures.get(
        designSystem.printCandidate(candidateWithoutModifier),
      )
      if (typeof targetSignatureWithoutModifier === 'string') {
        for (let replacementCandidate of tryReplacements(
          targetSignatureWithoutModifier,
          candidateWithoutModifier,
        )) {
          yield Object.assign({}, replacementCandidate, { modifier: candidate.modifier })
        }
      }
    }

    // If only a single utility maps to the signature, we can use that as the
    // replacement.
    if (replacements.length === 1) {
      for (let replacementCandidate of parseCandidate(designSystem, replacements[0])) {
        yield replacementCandidate
      }
    }
  }
}

// ----

const DEPRECATION_MAP = new Map([['order-none', 'order-0']])

function deprecatedUtilities(designSystem: DesignSystem, rawCandidate: string): string {
  let signatures = computeUtilitySignature.get(designSystem)

  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    // The below logic makes use of mutation. Since candidates in the
    // DesignSystem are cached, we can't mutate them directly.
    let candidate = structuredClone(readonlyCandidate) as Writable<typeof readonlyCandidate>

    // Create a basic stripped candidate without variants or important flag. We
    // will re-add those later but they are irrelevant for what we are trying to
    // do here (and will increase cache hits because we only have to deal with
    // the base utility, nothing more).
    let targetCandidate = baseCandidate(candidate)
    let targetCandidateString = printUnprefixedCandidate(designSystem, targetCandidate)

    let replacementString = DEPRECATION_MAP.get(targetCandidateString) ?? null
    if (replacementString === null) return rawCandidate

    let legacySignature = signatures.get(targetCandidateString)
    if (typeof legacySignature !== 'string') return rawCandidate

    let replacementSignature = signatures.get(replacementString)
    if (typeof replacementSignature !== 'string') return rawCandidate

    // Not the same signature, not safe to migrate
    if (legacySignature !== replacementSignature) return rawCandidate

    let [replacement] = parseCandidate(designSystem, replacementString)

    // Re-add the variants and important flag from the original candidate
    return designSystem.printCandidate(
      Object.assign(structuredClone(replacement), {
        variants: candidate.variants,
        important: candidate.important,
      }),
    )
  }

  return rawCandidate
}

// ----

function arbitraryVariants(designSystem: DesignSystem, rawCandidate: string): string {
  let signatures = computeVariantSignature.get(designSystem)
  let variants = preComputedVariants.get(designSystem)

  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    // We are only interested in the variants
    if (readonlyCandidate.variants.length <= 0) return rawCandidate

    // The below logic makes use of mutation. Since candidates in the
    // DesignSystem are cached, we can't mutate them directly.
    let candidate = structuredClone(readonlyCandidate) as Writable<typeof readonlyCandidate>

    for (let [variant] of walkVariants(candidate)) {
      if (variant.kind === 'compound') continue

      let targetString = designSystem.printVariant(variant)
      let targetSignature = signatures.get(targetString)
      if (typeof targetSignature !== 'string') continue

      let foundVariants = variants.get(targetSignature)
      if (foundVariants.length !== 1) continue

      let foundVariant = foundVariants[0]
      let parsedVariant = designSystem.parseVariant(foundVariant)
      if (parsedVariant === null) continue

      replaceObject(variant, parsedVariant)
    }

    return designSystem.printCandidate(candidate)
  }

  return rawCandidate
}

// ----

function dropUnnecessaryDataTypes(designSystem: DesignSystem, rawCandidate: string): string {
  let signatures = computeUtilitySignature.get(designSystem)

  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (
      candidate.kind === 'functional' &&
      candidate.value?.kind === 'arbitrary' &&
      candidate.value.dataType !== null
    ) {
      let replacement = designSystem.printCandidate({
        ...candidate,
        value: { ...candidate.value, dataType: null },
      })

      if (signatures.get(rawCandidate) === signatures.get(replacement)) {
        return replacement
      }
    }
  }

  return rawCandidate
}

// ----

function arbitraryValueToBareValue(designSystem: DesignSystem, rawCandidate: string): string {
  let signatures = computeUtilitySignature.get(designSystem)

  for (let candidate of parseCandidate(designSystem, rawCandidate)) {
    let clone = structuredClone(candidate) as Writable<typeof candidate>
    let changed = false

    // Migrate arbitrary values to bare values
    if (clone.kind === 'functional' && clone.value?.kind === 'arbitrary') {
      let expectedSignature = signatures.get(rawCandidate)
      if (expectedSignature !== null) {
        for (let value of tryValueReplacements(clone)) {
          let newSignature = signatures.get(designSystem.printCandidate({ ...clone, value }))
          if (newSignature === expectedSignature) {
            changed = true
            clone.value = value
            break
          }
        }
      }
    }

    for (let [variant] of walkVariants(clone)) {
      // Convert `data-[selected]` to `data-selected`
      if (
        variant.kind === 'functional' &&
        variant.root === 'data' &&
        variant.value?.kind === 'arbitrary' &&
        !variant.value.value.includes('=')
      ) {
        changed = true
        variant.value = {
          kind: 'named',
          value: variant.value.value,
        }
      }

      // Convert `aria-[selected="true"]` to `aria-selected`
      else if (
        variant.kind === 'functional' &&
        variant.root === 'aria' &&
        variant.value?.kind === 'arbitrary' &&
        (variant.value.value.endsWith('=true') ||
          variant.value.value.endsWith('="true"') ||
          variant.value.value.endsWith("='true'"))
      ) {
        let [key, _value] = segment(variant.value.value, '=')
        if (
          // aria-[foo~="true"]
          key[key.length - 1] === '~' ||
          // aria-[foo|="true"]
          key[key.length - 1] === '|' ||
          // aria-[foo^="true"]
          key[key.length - 1] === '^' ||
          // aria-[foo$="true"]
          key[key.length - 1] === '$' ||
          // aria-[foo*="true"]
          key[key.length - 1] === '*'
        ) {
          continue
        }

        changed = true
        variant.value = {
          kind: 'named',
          value: variant.value.value.slice(0, variant.value.value.indexOf('=')),
        }
      }

      // Convert `supports-[gap]` to `supports-gap`
      else if (
        variant.kind === 'functional' &&
        variant.root === 'supports' &&
        variant.value?.kind === 'arbitrary' &&
        /^[a-z-][a-z0-9-]*$/i.test(variant.value.value)
      ) {
        changed = true
        variant.value = {
          kind: 'named',
          value: variant.value.value,
        }
      }
    }

    return changed ? designSystem.printCandidate(clone) : rawCandidate
  }

  return rawCandidate
}

// Convert functional utilities with arbitrary values to bare values if we can.
// We know that bare values can only be:
//
// 1. A number (with increments of .25)
// 2. A percentage (with increments of .25 followed by a `%`)
// 3. A ratio with whole numbers
//
// Not a bare value per se, but if we are dealing with a keyword, that could
// potentially also look like a bare value (aka no `[` or `]`). E.g.:
// ```diff
// grid-cols-[subgrid]
// grid-cols-subgrid
// ```
function* tryValueReplacements(
  candidate: Extract<Candidate, { kind: 'functional' }>,
  value: string = candidate.value?.value ?? '',
  seen: Set<string> = new Set(),
): Generator<NamedUtilityValue> {
  if (seen.has(value)) return
  seen.add(value)

  // 0. Just try to drop the square brackets and see if it works
  // 1. A number (with increments of .25)
  yield {
    kind: 'named',
    value,
    fraction: null,
  }

  // 2. A percentage (with increments of .25 followed by a `%`)
  //    Try to drop the `%` and see if it works
  if (value.endsWith('%') && isValidSpacingMultiplier(value.slice(0, -1))) {
    yield {
      kind: 'named',
      value: value.slice(0, -1),
      fraction: null,
    }
  }

  // 3. A ratio with whole numbers
  if (value.includes('/')) {
    let [numerator, denominator] = value.split('/')
    if (isPositiveInteger(numerator) && isPositiveInteger(denominator)) {
      yield {
        kind: 'named',
        value: numerator,
        fraction: `${numerator}/${denominator}`,
      }
    }
  }

  // It could also be that we have `20px`, we can try just `20` and see if it
  // results in the same signature.
  let allNumbersAndFractions = new Set<string>()

  // Figure out all numbers and fractions in the value
  for (let match of value.matchAll(/(\d+\/\d+)|(\d+\.?\d+)/g)) {
    allNumbersAndFractions.add(match[0].trim())
  }

  // Sort the numbers and fractions where the smallest length comes first. This
  // will result in the smallest replacement.
  let options = Array.from(allNumbersAndFractions).sort((a, z) => {
    return a.length - z.length
  })

  // Try all the options
  for (let option of options) {
    yield* tryValueReplacements(candidate, option, seen)
  }
}

// ----

function isSingleSelector(ast: SelectorParser.SelectorAstNode[]): boolean {
  return !ast.some((node) => node.kind === 'separator' && node.value.trim() === ',')
}

function isAttributeSelector(node: SelectorParser.SelectorAstNode): boolean {
  let value = node.value.trim()
  return node.kind === 'selector' && value[0] === '[' && value[value.length - 1] === ']'
}

function isAsciiWhitespace(char: string) {
  return char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '\f'
}

enum AttributePart {
  Start,
  Attribute,
  Value,
  Modifier,
  End,
}

function parseAttributeSelector(value: string) {
  let attribute = {
    key: '',
    operator: null as '=' | '~=' | '|=' | '^=' | '$=' | '*=' | null,
    quote: '',
    value: null as string | null,
    modifier: null as 'i' | 's' | null,
  }

  let state = AttributePart.Start
  outer: for (let i = 0; i < value.length; i++) {
    // Skip whitespace
    if (isAsciiWhitespace(value[i])) {
      if (attribute.quote === '' && state !== AttributePart.Value) {
        continue
      }
    }

    switch (state) {
      case AttributePart.Start: {
        if (value[i] === '[') {
          state = AttributePart.Attribute
        } else {
          return null
        }
        break
      }

      case AttributePart.Attribute: {
        switch (value[i]) {
          case ']': {
            return attribute
          }

          case '=': {
            attribute.operator = '='
            state = AttributePart.Value
            continue outer
          }

          case '~':
          case '|':
          case '^':
          case '$':
          case '*': {
            if (value[i + 1] === '=') {
              attribute.operator = (value[i] + '=') as '=' | '~=' | '|=' | '^=' | '$=' | '*='
              i++
              state = AttributePart.Value
              continue outer
            }

            return null
          }
        }

        attribute.key += value[i]
        break
      }

      case AttributePart.Value: {
        // End of attribute selector
        if (value[i] === ']') {
          return attribute
        }

        // Quoted value
        else if (value[i] === "'" || value[i] === '"') {
          attribute.value ??= ''

          attribute.quote = value[i]

          for (let j = i + 1; j < value.length; j++) {
            if (value[j] === '\\' && j + 1 < value.length) {
              // Skip the escaped character
              j++
              attribute.value += value[j]
            } else if (value[j] === attribute.quote) {
              i = j
              state = AttributePart.Modifier
              continue outer
            } else {
              attribute.value += value[j]
            }
          }
        }

        // Unquoted value
        else {
          if (isAsciiWhitespace(value[i])) {
            state = AttributePart.Modifier
          } else {
            attribute.value ??= ''
            attribute.value += value[i]
          }
        }
        break
      }

      case AttributePart.Modifier: {
        if (value[i] === 'i' || value[i] === 's') {
          attribute.modifier = value[i] as 'i' | 's'
          state = AttributePart.End
        } else if (value[i] == ']') {
          return attribute
        }
        break
      }

      case AttributePart.End: {
        if (value[i] === ']') {
          return attribute
        }
        break
      }
    }
  }

  return attribute
}

function modernizeArbitraryValues(designSystem: DesignSystem, rawCandidate: string): string {
  let signatures = computeVariantSignature.get(designSystem)

  for (let candidate of parseCandidate(designSystem, rawCandidate)) {
    let clone = structuredClone(candidate)
    let changed = false

    for (let [variant, parent] of walkVariants(clone)) {
      // Forward modifier from the root to the compound variant
      if (
        variant.kind === 'compound' &&
        (variant.root === 'has' || variant.root === 'not' || variant.root === 'in')
      ) {
        if (variant.modifier !== null) {
          if ('modifier' in variant.variant) {
            variant.variant.modifier = variant.modifier
            variant.modifier = null
          }
        }
      }

      // Expecting an arbitrary variant
      if (variant.kind === 'arbitrary') {
        // Expecting a non-relative arbitrary variant
        if (variant.relative) continue

        let ast = SelectorParser.parse(variant.selector.trim())

        // Expecting a single selector node
        if (!isSingleSelector(ast)) continue

        // `[&>*]` can be replaced with `*`
        if (
          // Only top-level, so `has-[&>*]` is not supported
          parent === null &&
          // [&_>_*]:flex
          //  ^ ^ ^
          ast.length === 3 &&
          ast[0].kind === 'selector' &&
          ast[0].value === '&' &&
          ast[1].kind === 'combinator' &&
          ast[1].value.trim() === '>' &&
          ast[2].kind === 'selector' &&
          ast[2].value === '*'
        ) {
          changed = true
          replaceObject(variant, designSystem.parseVariant('*'))
          continue
        }

        // `[&_*]` can be replaced with `**`
        if (
          // Only top-level, so `has-[&_*]` is not supported
          parent === null &&
          // [&_*]:flex
          //  ^ ^
          ast.length === 3 &&
          ast[0].kind === 'selector' &&
          ast[0].value === '&' &&
          ast[1].kind === 'combinator' &&
          ast[1].value.trim() === '' && // space, but trimmed because there could be multiple spaces
          ast[2].kind === 'selector' &&
          ast[2].value === '*'
        ) {
          changed = true
          replaceObject(variant, designSystem.parseVariant('**'))
          continue
        }

        // `in-*` variant. If the selector ends with ` &`, we can convert it to an
        // `in-*` variant.
        //
        // E.g.: `[[data-visible]_&]` => `in-data-visible`
        if (
          // Only top-level, so `in-[&_[data-visible]]` is not supported
          parent === null &&
          // [[data-visible]___&]:flex
          //  ^^^^^^^^^^^^^^ ^ ^
          ast.length === 3 &&
          ast[1].kind === 'combinator' &&
          ast[1].value.trim() === '' && // Space, but trimmed because there could be multiple spaces
          ast[2].kind === 'selector' &&
          ast[2].value === '&'
        ) {
          ast.pop() // Remove the nesting node
          ast.pop() // Remove the combinator

          changed = true
          // When handling a compound like `in-[[data-visible]]`, we will first
          // handle `[[data-visible]]`, then the parent `in-*` part. This means
          // that we can convert `[[data-visible]_&]` to `in-[[data-visible]]`.
          //
          // Later this gets converted to `in-data-visible`.
          replaceObject(variant, designSystem.parseVariant(`in-[${SelectorParser.toCss(ast)}]`))
          continue
        }

        // Hoist `not` modifier for `@media` or `@supports` variants
        //
        // E.g.: `[@media_not_(scripting:none)]:` -> `not-[@media_(scripting:none)]:`
        if (
          // Only top-level, so something like `in-[@media(scripting:none)]`
          // (which is not valid anyway) is not supported
          parent === null &&
          // [@media_not(scripting:none)]:flex
          //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^
          ast[0].kind === 'selector' &&
          (ast[0].value === '@media' || ast[0].value === '@supports')
        ) {
          let targetSignature = signatures.get(designSystem.printVariant(variant))

          let parsed = ValueParser.parse(SelectorParser.toCss(ast))
          let containsNot = false
          ValueParser.walk(parsed, (node, { replaceWith }) => {
            if (node.kind === 'word' && node.value === 'not') {
              containsNot = true
              replaceWith([])
            }
          })

          // Remove unnecessary whitespace
          parsed = ValueParser.parse(ValueParser.toCss(parsed))
          ValueParser.walk(parsed, (node) => {
            if (node.kind === 'separator' && node.value !== ' ' && node.value.trim() === '') {
              // node.value contains at least 2 spaces. Normalize it to a single
              // space.
              node.value = ' '
            }
          })

          if (containsNot) {
            let hoistedNot = designSystem.parseVariant(`not-[${ValueParser.toCss(parsed)}]`)
            if (hoistedNot === null) continue
            let hoistedNotSignature = signatures.get(designSystem.printVariant(hoistedNot))
            if (targetSignature === hoistedNotSignature) {
              changed = true
              replaceObject(variant, hoistedNot)
              continue
            }
          }
        }

        let prefixedVariant: Variant | null = null

        // Handling a child combinator. E.g.: `[&>[data-visible]]` => `*:data-visible`
        if (
          // Only top-level, so `has-[&>[data-visible]]` is not supported
          parent === null &&
          // [&_>_[data-visible]]:flex
          //  ^ ^ ^^^^^^^^^^^^^^
          ast.length === 3 &&
          ast[0].kind === 'selector' &&
          ast[0].value.trim() === '&' &&
          ast[1].kind === 'combinator' &&
          ast[1].value.trim() === '>' &&
          ast[2].kind === 'selector' &&
          isAttributeSelector(ast[2])
        ) {
          ast = [ast[2]]
          prefixedVariant = designSystem.parseVariant('*')
        }

        // Handling a grand child combinator. E.g.: `[&_[data-visible]]` => `**:data-visible`
        if (
          // Only top-level, so `has-[&_[data-visible]]` is not supported
          parent === null &&
          // [&_[data-visible]]:flex
          //  ^ ^^^^^^^^^^^^^^
          ast.length === 3 &&
          ast[0].kind === 'selector' &&
          ast[0].value.trim() === '&' &&
          ast[1].kind === 'combinator' &&
          ast[1].value.trim() === '' && // space, but trimmed because there could be multiple spaces
          ast[2].kind === 'selector' &&
          isAttributeSelector(ast[2])
        ) {
          ast = [ast[2]]
          prefixedVariant = designSystem.parseVariant('**')
        }

        // Filter out `&`. E.g.: `&[data-foo]` => `[data-foo]`
        let selectorNodes = ast.filter(
          (node) => !(node.kind === 'selector' && node.value.trim() === '&'),
        )

        // Expecting a single selector (normal selector or attribute selector)
        if (selectorNodes.length !== 1) continue

        let target = selectorNodes[0]
        if (target.kind === 'function' && target.value === ':is') {
          // Expecting a single selector node
          if (
            !isSingleSelector(target.nodes) ||
            // [foo][bar] is considered a single selector but has multiple nodes
            target.nodes.length !== 1
          )
            continue

          // Expecting a single attribute selector
          if (!isAttributeSelector(target.nodes[0])) continue

          // Unwrap the selector from inside `&:is(…)`
          target = target.nodes[0]
        }

        // Expecting a pseudo selector (or function)
        if (
          (target.kind === 'function' && target.value[0] === ':') ||
          (target.kind === 'selector' && target.value[0] === ':')
        ) {
          let targetNode = target
          let compoundNot = false
          if (targetNode.kind === 'function' && targetNode.value === ':not') {
            compoundNot = true
            if (targetNode.nodes.length !== 1) continue
            if (
              targetNode.nodes[0].kind !== 'selector' &&
              targetNode.nodes[0].kind !== 'function'
            ) {
              continue
            }
            if (targetNode.nodes[0].value[0] !== ':') continue

            targetNode = targetNode.nodes[0]
          }

          let newVariant = ((value) => {
            if (
              value === ':nth-child' &&
              targetNode.kind === 'function' &&
              targetNode.nodes.length === 1 &&
              targetNode.nodes[0].kind === 'value' &&
              targetNode.nodes[0].value === 'odd'
            ) {
              if (compoundNot) {
                compoundNot = false
                return 'even'
              }
              return 'odd'
            }

            if (
              value === ':nth-child' &&
              targetNode.kind === 'function' &&
              targetNode.nodes.length === 1 &&
              targetNode.nodes[0].kind === 'value' &&
              targetNode.nodes[0].value === 'even'
            ) {
              if (compoundNot) {
                compoundNot = false
                return 'odd'
              }
              return 'even'
            }

            for (let [selector, variantName] of [
              [':nth-child', 'nth'],
              [':nth-last-child', 'nth-last'],
              [':nth-of-type', 'nth-of-type'],
              [':nth-last-of-type', 'nth-of-last-type'],
            ]) {
              if (
                value === selector &&
                targetNode.kind === 'function' &&
                targetNode.nodes.length === 1
              ) {
                if (
                  targetNode.nodes.length === 1 &&
                  targetNode.nodes[0].kind === 'value' &&
                  isPositiveInteger(targetNode.nodes[0].value)
                ) {
                  return `${variantName}-${targetNode.nodes[0].value}`
                }

                return `${variantName}-[${SelectorParser.toCss(targetNode.nodes)}]`
              }
            }

            // Hoist `not` modifier
            if (compoundNot) {
              let targetSignature = signatures.get(designSystem.printVariant(variant))
              let replacementSignature = signatures.get(`not-[${value}]`)
              if (targetSignature === replacementSignature) {
                return `[&${value}]`
              }
            }

            return null
          })(targetNode.value)

          if (newVariant === null) continue

          // Add `not-` prefix
          if (compoundNot) newVariant = `not-${newVariant}`

          let parsed = designSystem.parseVariant(newVariant)
          if (parsed === null) continue

          // Update original variant
          changed = true
          replaceObject(variant, structuredClone(parsed))
        }

        // Expecting an attribute selector
        else if (isAttributeSelector(target)) {
          let attribute = parseAttributeSelector(target.value)
          if (attribute === null) continue // Invalid attribute selector

          // Migrate `data-*`
          if (attribute.key.startsWith('data-')) {
            changed = true
            let name = attribute.key.slice(5) // Remove `data-`

            replaceObject(variant, {
              kind: 'functional',
              root: 'data',
              modifier: null,
              value:
                attribute.value === null
                  ? { kind: 'named', value: name }
                  : {
                      kind: 'arbitrary',
                      value: `${name}${attribute.operator}${attribute.quote}${attribute.value}${attribute.quote}${attribute.modifier ? ` ${attribute.modifier}` : ''}`,
                    },
            } satisfies Variant)
          }

          // Migrate `aria-*`
          else if (attribute.key.startsWith('aria-')) {
            changed = true
            let name = attribute.key.slice(5) // Remove `aria-`
            replaceObject(variant, {
              kind: 'functional',
              root: 'aria',
              modifier: null,
              value:
                attribute.value === null
                  ? { kind: 'arbitrary', value: name } // aria-[foo]
                  : attribute.operator === '=' &&
                      attribute.value === 'true' &&
                      attribute.modifier === null
                    ? { kind: 'named', value: name } // aria-[foo="true"] or aria-[foo='true'] or aria-[foo=true]
                    : {
                        kind: 'arbitrary',
                        value: `${attribute.key}${attribute.operator}${attribute.quote}${attribute.value}${attribute.quote}${attribute.modifier ? ` ${attribute.modifier}` : ''}`,
                      }, // aria-[foo~="true"], aria-[foo|="true"], …
            } satisfies Variant)
          }
        }

        if (prefixedVariant) {
          let idx = clone.variants.indexOf(variant)
          if (idx === -1) continue

          // Ensure we inject the prefixed variant
          clone.variants.splice(idx, 1, variant, prefixedVariant)
        }
      }
    }

    return changed ? designSystem.printCandidate(clone) : rawCandidate
  }

  return rawCandidate
}

// ----

// Optimize the modifier
//
// E.g.:
//
// - `/[25%]`   → `/25`
// - `/[100%]`  → `/100`    → <empty>
// - `/100`     → <empty>
//
function optimizeModifier(designSystem: DesignSystem, rawCandidate: string): string {
  let signatures = computeUtilitySignature.get(designSystem)

  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    let candidate = structuredClone(readonlyCandidate) as Writable<typeof readonlyCandidate>
    if (
      (candidate.kind === 'functional' && candidate.modifier !== null) ||
      (candidate.kind === 'arbitrary' && candidate.modifier !== null)
    ) {
      let targetSignature = signatures.get(rawCandidate)
      let modifier = candidate.modifier
      let changed = false

      // 1. Try to drop the modifier entirely
      if (
        targetSignature ===
        signatures.get(designSystem.printCandidate({ ...candidate, modifier: null }))
      ) {
        changed = true
        candidate.modifier = null
      }

      // 2. Try to remove the square brackets and the `%` sign
      if (!changed) {
        let newModifier: NamedUtilityValue = {
          kind: 'named',
          value: modifier.value.endsWith('%') ? modifier.value.slice(0, -1) : modifier.value,
          fraction: null,
        }

        if (
          targetSignature ===
          signatures.get(designSystem.printCandidate({ ...candidate, modifier: newModifier }))
        ) {
          changed = true
          candidate.modifier = newModifier
        }
      }

      // 3. Try to remove the square brackets, but multiply by 100. E.g.: `[0.16]` -> `16`
      if (!changed) {
        let newModifier: NamedUtilityValue = {
          kind: 'named',
          value: `${parseFloat(modifier.value) * 100}`,
          fraction: null,
        }

        if (
          targetSignature ===
          signatures.get(designSystem.printCandidate({ ...candidate, modifier: newModifier }))
        ) {
          changed = true
          candidate.modifier = newModifier
        }
      }

      return changed ? designSystem.printCandidate(candidate) : rawCandidate
    }
  }

  return rawCandidate
}
