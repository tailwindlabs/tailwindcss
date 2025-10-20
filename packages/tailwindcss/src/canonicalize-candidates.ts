import * as AttributeSelectorParser from './attribute-selector-parser'
import {
  cloneCandidate,
  cloneVariant,
  printModifier,
  type Candidate,
  type CandidateModifier,
  type NamedUtilityValue,
  type Variant,
} from './candidate'
import { keyPathToCssProperty } from './compat/apply-config-to-theme'
import type { DesignSystem } from './design-system'
import * as SelectorParser from './selector-parser'
import {
  computeUtilitySignature,
  computeVariantSignature,
  preComputedUtilities,
  preComputedVariants,
  type SignatureOptions,
} from './signatures'
import type { Writable } from './types'
import { DefaultMap } from './utils/default-map'
import { dimensions } from './utils/dimensions'
import { isPositiveInteger, isValidSpacingMultiplier } from './utils/infer-data-type'
import { replaceObject } from './utils/replace-object'
import { segment } from './utils/segment'
import { toKeyPath } from './utils/to-key-path'
import * as ValueParser from './value-parser'
import { walk, WalkAction } from './walk'

export interface CanonicalizeOptions {
  /**
   * The root font size in pixels. If provided, `rem` values will be normalized
   * to `px` values.
   *
   * E.g.: `mt-[16px]` with `rem: 16` will become `mt-4` (assuming `--spacing: 0.25rem`).
   */
  rem?: number
}

const optionsCache = new DefaultMap((designSystem: DesignSystem) => {
  return new DefaultMap((rem: number | null = null) => {
    return { designSystem, rem } satisfies SignatureOptions
  })
})

export function createSignatureOptions(
  designSystem: DesignSystem,
  options?: CanonicalizeOptions,
): SignatureOptions {
  return optionsCache.get(designSystem).get(options?.rem ?? null)
}

export function canonicalizeCandidates(
  designSystem: DesignSystem,
  candidates: string[],
  options?: CanonicalizeOptions,
): string[] {
  let result = new Set<string>()
  let cache = canonicalizeCandidateCache.get(createSignatureOptions(designSystem, options))
  for (let candidate of candidates) {
    result.add(cache.get(candidate))
  }
  return Array.from(result)
}

const canonicalizeCandidateCache = new DefaultMap((options: SignatureOptions) => {
  let ds = options.designSystem
  let prefix = ds.theme.prefix ? `${ds.theme.prefix}:` : ''
  let variantCache = canonicalizeVariantCache.get(options)
  let utilityCache = canonicalizeUtilityCache.get(options)

  return new DefaultMap<string, string>((rawCandidate: string, self) => {
    for (let candidate of ds.parseCandidate(rawCandidate)) {
      let variants = candidate.variants
        .slice()
        .reverse()
        .flatMap((variant) => variantCache.get(variant))
      let important = candidate.important

      // Canonicalize the base candidate (utility), and re-attach the variants
      // and important flag afterwards. This way we can maximize cache hits for
      // the base candidate and each individual variant.
      if (important || variants.length > 0) {
        let canonicalizedUtility = self.get(
          ds.printCandidate({ ...candidate, variants: [], important: false }),
        )

        // Rebuild the final candidate
        let result = canonicalizedUtility

        // Remove the prefix if there are variants, because the variants exist
        // between the prefix and the base candidate.
        if (ds.theme.prefix !== null && variants.length > 0) {
          result = result.slice(prefix.length)
        }

        // Re-attach the variants
        if (variants.length > 0) {
          result = `${variants.map((v) => ds.printVariant(v)).join(':')}:${result}`
        }

        // Re-attach the important flag
        if (important) {
          result += '!'
        }

        // Re-attach the prefix if there were variants
        if (ds.theme.prefix !== null && variants.length > 0) {
          result = `${prefix}${result}`
        }

        return result
      }

      // We are guaranteed to have no variants and no important flag, just the
      // base candidate left to canonicalize.
      let result = utilityCache.get(rawCandidate)
      if (result !== rawCandidate) {
        return result
      }
    }

    return rawCandidate
  })
})

type VariantCanonicalizationFunction = (
  variant: Variant,
  options: SignatureOptions,
) => Variant | Variant[]

const VARIANT_CANONICALIZATIONS: VariantCanonicalizationFunction[] = [
  themeToVarVariant,
  arbitraryValueToBareValueVariant,
  modernizeArbitraryValuesVariant,
  arbitraryVariants,
]

const canonicalizeVariantCache = new DefaultMap((options: SignatureOptions) => {
  return new DefaultMap((variant: Variant): Variant[] => {
    let replacement = [variant]
    for (let fn of VARIANT_CANONICALIZATIONS) {
      for (let current of replacement.splice(0)) {
        // A single variant can result in multiple variants, e.g.:
        // `[&>[data-selected]]:flex` → `*:data-selected:flex`
        let result = fn(cloneVariant(current), options)
        if (Array.isArray(result)) {
          replacement.push(...result)
          continue
        } else {
          replacement.push(result)
        }
      }
    }
    return replacement
  })
})

type UtilityCanonicalizationFunction = (
  candidate: Candidate,
  options: SignatureOptions,
) => Candidate

const UTILITY_CANONICALIZATIONS: UtilityCanonicalizationFunction[] = [
  bgGradientToLinear,
  themeToVarUtility,
  arbitraryUtilities,
  bareValueUtilities,
  deprecatedUtilities,
  dropUnnecessaryDataTypes,
  arbitraryValueToBareValueUtility,
  optimizeModifier,
]

const canonicalizeUtilityCache = new DefaultMap((options: SignatureOptions) => {
  let designSystem = options.designSystem
  return new DefaultMap((rawCandidate: string): string => {
    for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
      let replacement = cloneCandidate(readonlyCandidate) as Writable<typeof readonlyCandidate>

      for (let fn of UTILITY_CANONICALIZATIONS) {
        replacement = fn(replacement, options)
      }

      let canonicalizedCandidate = designSystem.printCandidate(replacement)
      if (rawCandidate !== canonicalizedCandidate) {
        return canonicalizedCandidate
      }
    }

    return rawCandidate
  })
})

// ----

const DIRECTIONS = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
function bgGradientToLinear(candidate: Candidate) {
  if (candidate.kind === 'static' && candidate.root.startsWith('bg-gradient-to-')) {
    let direction = candidate.root.slice(15)

    if (!DIRECTIONS.includes(direction)) {
      return candidate
    }

    candidate.root = `bg-linear-to-${direction}`
    return candidate
  }

  return candidate
}

// ----

const enum Convert {
  All = 0,
  MigrateModifier = 1 << 0,
  MigrateThemeOnly = 1 << 1,
}

function themeToVarUtility(candidate: Candidate, options: SignatureOptions): Candidate {
  let convert = converterCache.get(options.designSystem)

  if (candidate.kind === 'arbitrary') {
    let [newValue, modifier] = convert(
      candidate.value,
      candidate.modifier === null ? Convert.MigrateModifier : Convert.All,
    )
    if (newValue !== candidate.value) {
      candidate.value = newValue

      if (modifier !== null) {
        candidate.modifier = modifier
      }
    }
  } else if (candidate.kind === 'functional' && candidate.value?.kind === 'arbitrary') {
    let [newValue, modifier] = convert(
      candidate.value.value,
      candidate.modifier === null ? Convert.MigrateModifier : Convert.All,
    )
    if (newValue !== candidate.value.value) {
      candidate.value.value = newValue

      if (modifier !== null) {
        candidate.modifier = modifier
      }
    }
  }

  return candidate
}

function themeToVarVariant(variant: Variant, options: SignatureOptions): Variant | Variant[] {
  let convert = converterCache.get(options.designSystem)

  let iterator = walkVariants(variant)
  for (let [variant] of iterator) {
    if (variant.kind === 'arbitrary') {
      let [newValue] = convert(variant.selector, Convert.MigrateThemeOnly)
      if (newValue !== variant.selector) {
        variant.selector = newValue
      }
    } else if (variant.kind === 'functional' && variant.value?.kind === 'arbitrary') {
      let [newValue] = convert(variant.value.value, Convert.MigrateThemeOnly)
      if (newValue !== variant.value.value) {
        variant.value.value = newValue
      }
    }
  }

  return variant
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
      walk(ast, (node) => {
        if (node.kind !== 'function') return
        if (node.value !== 'theme') return

        // We are only interested in the `theme` function
        themeUsageCount += 1

        // Figure out if a modifier is used
        walk(node.nodes, (child) => {
          // If we see a `,`, it means that we have a fallback value
          if (child.kind === 'separator' && child.value.includes(',')) {
            return WalkAction.Stop
          }

          // If we see a `/`, we have a modifier
          else if (child.kind === 'word' && child.value === '/') {
            themeModifierCount += 1
            return WalkAction.Stop
          }

          return WalkAction.Skip
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
  walk(ast, (node, ctx) => {
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

      if (ctx.parent) {
        let idx = ctx.parent.nodes.indexOf(node) - 1
        while (idx !== -1) {
          let previous = ctx.parent.nodes[idx]
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

      return WalkAction.Replace(ValueParser.parse(replacement))
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

function* walkVariants(variant: Variant) {
  function* inner(
    variant: Variant,
    parent: Extract<Variant, { kind: 'compound' }> | null = null,
  ): Iterable<[Variant, Extract<Variant, { kind: 'compound' }> | null]> {
    yield [variant, parent]

    if (variant.kind === 'compound') {
      yield* inner(variant.variant, variant)
    }
  }

  yield* inner(variant, null)
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

function arbitraryUtilities(candidate: Candidate, options: SignatureOptions): Candidate {
  // We are only interested in arbitrary properties and arbitrary values
  if (
    // Arbitrary property
    candidate.kind !== 'arbitrary' &&
    // Arbitrary value
    !(candidate.kind === 'functional' && candidate.value?.kind === 'arbitrary')
  ) {
    return candidate
  }

  let designSystem = options.designSystem
  let utilities = preComputedUtilities.get(options)
  let signatures = computeUtilitySignature.get(options)

  let targetCandidateString = designSystem.printCandidate(candidate)

  // Compute the signature for the target candidate
  let targetSignature = signatures.get(targetCandidateString)
  if (typeof targetSignature !== 'string') return candidate

  // Try a few options to find a suitable replacement utility
  for (let replacementCandidate of tryReplacements(targetSignature, candidate)) {
    let replacementString = designSystem.printCandidate(replacementCandidate)
    let replacementSignature = signatures.get(replacementString)
    if (replacementSignature !== targetSignature) {
      continue
    }

    // Ensure that if CSS variables were used, that they are still used
    if (!allVariablesAreUsed(designSystem, candidate, replacementCandidate)) {
      continue
    }

    return replacementCandidate
  }

  return candidate

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
  walk(ValueParser.parse(value), (node) => {
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
        return WalkAction.Stop
      }
    }
  })

  return isSafeMigration
}

// ----

function bareValueUtilities(candidate: Candidate, options: SignatureOptions): Candidate {
  // We are only interested in bare value utilities
  if (candidate.kind !== 'functional' || candidate.value?.kind !== 'named') {
    return candidate
  }

  let designSystem = options.designSystem
  let utilities = preComputedUtilities.get(options)
  let signatures = computeUtilitySignature.get(options)

  let targetCandidateString = designSystem.printCandidate(candidate)

  // Compute the signature for the target candidate
  let targetSignature = signatures.get(targetCandidateString)
  if (typeof targetSignature !== 'string') return candidate

  // Try a few options to find a suitable replacement utility
  for (let replacementCandidate of tryReplacements(targetSignature, candidate)) {
    let replacementString = designSystem.printCandidate(replacementCandidate)
    let replacementSignature = signatures.get(replacementString)
    if (replacementSignature !== targetSignature) {
      continue
    }

    return replacementCandidate
  }

  return candidate

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

const DEPRECATION_MAP = new Map([
  ['order-none', 'order-0'],
  ['break-words', 'wrap-break-word'],
])

function deprecatedUtilities(candidate: Candidate, options: SignatureOptions): Candidate {
  let designSystem = options.designSystem
  let signatures = computeUtilitySignature.get(options)

  let targetCandidateString = printUnprefixedCandidate(designSystem, candidate)

  let replacementString = DEPRECATION_MAP.get(targetCandidateString) ?? null
  if (replacementString === null) return candidate

  let legacySignature = signatures.get(targetCandidateString)
  if (typeof legacySignature !== 'string') return candidate

  let replacementSignature = signatures.get(replacementString)
  if (typeof replacementSignature !== 'string') return candidate

  // Not the same signature, not safe to migrate
  if (legacySignature !== replacementSignature) return candidate

  let [replacement] = parseCandidate(designSystem, replacementString)
  return replacement
}

// ----

function arbitraryVariants(variant: Variant, options: SignatureOptions): Variant | Variant[] {
  let designSystem = options.designSystem
  let signatures = computeVariantSignature.get(options)
  let variants = preComputedVariants.get(options)

  let iterator = walkVariants(variant)
  for (let [variant] of iterator) {
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

  return variant
}

// ----

function dropUnnecessaryDataTypes(candidate: Candidate, options: SignatureOptions): Candidate {
  let designSystem = options.designSystem
  let signatures = computeUtilitySignature.get(options)

  if (
    candidate.kind === 'functional' &&
    candidate.value?.kind === 'arbitrary' &&
    candidate.value.dataType !== null
  ) {
    let replacement = designSystem.printCandidate({
      ...candidate,
      value: { ...candidate.value, dataType: null },
    })

    if (signatures.get(designSystem.printCandidate(candidate)) === signatures.get(replacement)) {
      candidate.value.dataType = null
    }
  }

  return candidate
}

// ----

function arbitraryValueToBareValueUtility(
  candidate: Candidate,
  options: SignatureOptions,
): Candidate {
  // We are only interested in functional utilities with arbitrary values
  if (candidate.kind !== 'functional' || candidate.value?.kind !== 'arbitrary') {
    return candidate
  }

  let designSystem = options.designSystem
  let signatures = computeUtilitySignature.get(options)

  let expectedSignature = signatures.get(designSystem.printCandidate(candidate))
  if (expectedSignature === null) return candidate

  for (let value of tryValueReplacements(candidate)) {
    let newSignature = signatures.get(designSystem.printCandidate({ ...candidate, value }))
    if (newSignature === expectedSignature) {
      candidate.value = value
      return candidate
    }
  }

  return candidate
}

function arbitraryValueToBareValueVariant(variant: Variant): Variant | Variant[] {
  let iterator = walkVariants(variant)
  for (let [variant] of iterator) {
    // Convert `data-[selected]` to `data-selected`
    if (
      variant.kind === 'functional' &&
      variant.root === 'data' &&
      variant.value?.kind === 'arbitrary' &&
      !variant.value.value.includes('=')
    ) {
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
      variant.value = {
        kind: 'named',
        value: variant.value.value,
      }
    }
  }

  return variant
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

function modernizeArbitraryValuesVariant(
  variant: Variant,
  options: SignatureOptions,
): Variant | Variant[] {
  let result = [variant]
  let designSystem = options.designSystem
  let signatures = computeVariantSignature.get(options)

  let iterator = walkVariants(variant)
  for (let [variant, parent] of iterator) {
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
        walk(parsed, (node) => {
          if (node.kind === 'word' && node.value === 'not') {
            containsNot = true
            return WalkAction.Replace([])
          }
        })

        // Remove unnecessary whitespace
        parsed = ValueParser.parse(ValueParser.toCss(parsed))
        walk(parsed, (node) => {
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
          if (targetNode.nodes[0].kind !== 'selector' && targetNode.nodes[0].kind !== 'function') {
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
        replaceObject(variant, parsed)
      }

      // Expecting an attribute selector
      else if (isAttributeSelector(target)) {
        let attributeSelector = AttributeSelectorParser.parse(target.value)
        if (attributeSelector === null) continue // Invalid attribute selector

        // Migrate `data-*`
        if (attributeSelector.attribute.startsWith('data-')) {
          let name = attributeSelector.attribute.slice(5) // Remove `data-`

          replaceObject(variant, {
            kind: 'functional',
            root: 'data',
            modifier: null,
            value:
              attributeSelector.value === null
                ? { kind: 'named', value: name }
                : {
                    kind: 'arbitrary',
                    value: `${name}${attributeSelector.operator}${attributeSelector.quote ?? ''}${attributeSelector.value}${attributeSelector.quote ?? ''}${attributeSelector.sensitivity ? ` ${attributeSelector.sensitivity}` : ''}`,
                  },
          } satisfies Variant)
        }

        // Migrate `aria-*`
        else if (attributeSelector.attribute.startsWith('aria-')) {
          let name = attributeSelector.attribute.slice(5) // Remove `aria-`
          replaceObject(variant, {
            kind: 'functional',
            root: 'aria',
            modifier: null,
            value:
              attributeSelector.value === null
                ? { kind: 'arbitrary', value: name } // aria-[foo]
                : attributeSelector.operator === '=' &&
                    attributeSelector.value === 'true' &&
                    attributeSelector.sensitivity === null
                  ? { kind: 'named', value: name } // aria-[foo="true"] or aria-[foo='true'] or aria-[foo=true]
                  : {
                      kind: 'arbitrary',
                      value: `${attributeSelector.attribute}${attributeSelector.operator}${attributeSelector.quote ?? ''}${attributeSelector.value}${attributeSelector.quote ?? ''}${attributeSelector.sensitivity ? ` ${attributeSelector.sensitivity}` : ''}`,
                    }, // aria-[foo~="true"], aria-[foo|="true"], …
          } satisfies Variant)
        }
      }

      if (prefixedVariant) {
        return [prefixedVariant, variant]
      }
    }
  }

  return result
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
function optimizeModifier(candidate: Candidate, options: SignatureOptions): Candidate {
  // We are only interested in functional or arbitrary utilities with a modifier
  if (
    (candidate.kind !== 'functional' && candidate.kind !== 'arbitrary') ||
    candidate.modifier === null
  ) {
    return candidate
  }

  let designSystem = options.designSystem
  let signatures = computeUtilitySignature.get(options)

  let targetSignature = signatures.get(designSystem.printCandidate(candidate))
  let modifier = candidate.modifier

  // 1. Try to drop the modifier entirely
  if (
    targetSignature ===
    signatures.get(designSystem.printCandidate({ ...candidate, modifier: null }))
  ) {
    candidate.modifier = null
    return candidate
  }

  // 2. Try to remove the square brackets and the `%` sign
  {
    let newModifier: NamedUtilityValue = {
      kind: 'named',
      value: modifier.value.endsWith('%')
        ? modifier.value.includes('.')
          ? `${Number(modifier.value.slice(0, -1))}`
          : modifier.value.slice(0, -1)
        : modifier.value,
      fraction: null,
    }

    if (
      targetSignature ===
      signatures.get(designSystem.printCandidate({ ...candidate, modifier: newModifier }))
    ) {
      candidate.modifier = newModifier
      return candidate
    }
  }

  // 3. Try to remove the square brackets, but multiply by 100. E.g.: `[0.16]` -> `16`
  {
    let newModifier: NamedUtilityValue = {
      kind: 'named',
      value: `${parseFloat(modifier.value) * 100}`,
      fraction: null,
    }

    if (
      targetSignature ===
      signatures.get(designSystem.printCandidate({ ...candidate, modifier: newModifier }))
    ) {
      candidate.modifier = newModifier
      return candidate
    }
  }

  return candidate
}
