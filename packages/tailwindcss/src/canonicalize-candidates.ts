import { substituteAtApply } from './apply'
import { atRule, cloneAstNode, styleRule, toCss, type AstNode } from './ast'
import * as AttributeSelectorParser from './attribute-selector-parser'
import {
  cloneCandidate,
  cloneVariant,
  printArbitraryValue,
  printModifier,
  type Candidate,
  type CandidateModifier,
  type NamedUtilityValue,
  type Variant,
} from './candidate'
import { keyPathToCssProperty } from './compat/apply-config-to-theme'
import { constantFoldDeclaration } from './constant-fold-declaration'
import type { DesignSystem as BaseDesignSystem } from './design-system'
import { CompileAstFlags } from './design-system'
import { expandDeclaration } from './expand-declaration'
import * as SelectorParser from './selector-parser'
import { ThemeOptions } from './theme'
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

  /**
   * Whether to collapse multiple utilities into a single utility if possible.
   *
   * E.g.: `mt-2 mr-2 mb-2 ml-2` → `m-2`
   */
  collapse?: boolean

  /**
   * Whether to convert between logical and physical properties when collapsing
   * utilities.
   *
   * E.g.: `mr-2 ml-2` → `mx-2`
   */
  logicalToPhysical?: boolean
}

enum Features {
  /**
   * No features enabled (default)
   */
  None = 0,

  /**
   * Collapse multiple utilities into a single utility if possible.
   */
  CollapseUtilities = 1 << 0,
}

interface InternalCanonicalizeOptions {
  features: Features
  designSystem: DesignSystem
  signatureOptions: SignatureOptions
}

interface DesignSystem extends BaseDesignSystem {
  storage: {
    [SIGNATURE_OPTIONS_KEY]: DefaultMap<
      number | null, // Rem value
      DefaultMap<SignatureFeatures, SignatureOptions>
    >
    [INTERNAL_OPTIONS_KEY]: DefaultMap<
      SignatureOptions,
      DefaultMap<Features, InternalCanonicalizeOptions>
    >
    [CANONICALIZE_CANDIDATE_KEY]: DefaultMap<
      InternalCanonicalizeOptions,
      DefaultMap<string, string>
    >
    [CANONICALIZE_VARIANT_KEY]: DefaultMap<
      InternalCanonicalizeOptions,
      DefaultMap<Variant, Variant[]>
    >
    [CANONICALIZE_UTILITY_KEY]: DefaultMap<InternalCanonicalizeOptions, DefaultMap<string, string>>
    [CONVERTER_KEY]: (input: string, options?: Convert) => [string, CandidateModifier | null]
    [SPACING_KEY]: DefaultMap<string, number | null> | null
    [UTILITY_SIGNATURE_KEY]: DefaultMap<SignatureOptions, DefaultMap<string, string | Symbol>>
    [STATIC_UTILITIES_KEY]: DefaultMap<
      SignatureOptions,
      DefaultMap<string, DefaultMap<string, Set<string>>>
    >
    [UTILITY_PROPERTIES_KEY]: DefaultMap<
      SignatureOptions,
      DefaultMap<string, DefaultMap<string, Set<string>>>
    >
    [PRE_COMPUTED_UTILITIES_KEY]: DefaultMap<SignatureOptions, DefaultMap<string, string[]>>
    [VARIANT_SIGNATURE_KEY]: DefaultMap<string, string | Symbol>
    [PRE_COMPUTED_VARIANTS_KEY]: DefaultMap<string, string[]>
  }
}

export function prepareDesignSystemStorage(baseDesignSystem: BaseDesignSystem): DesignSystem {
  let designSystem = baseDesignSystem as DesignSystem

  designSystem.storage[SIGNATURE_OPTIONS_KEY] ??= createSignatureOptionsCache()
  designSystem.storage[INTERNAL_OPTIONS_KEY] ??= createInternalOptionsCache(designSystem)
  designSystem.storage[CANONICALIZE_CANDIDATE_KEY] ??= createCanonicalizeCandidateCache()
  designSystem.storage[CANONICALIZE_VARIANT_KEY] ??= createCanonicalizeVariantCache()
  designSystem.storage[CANONICALIZE_UTILITY_KEY] ??= createCanonicalizeUtilityCache()
  designSystem.storage[CONVERTER_KEY] ??= createConverterCache(designSystem)
  designSystem.storage[SPACING_KEY] ??= createSpacingCache(designSystem)
  designSystem.storage[UTILITY_SIGNATURE_KEY] ??= createUtilitySignatureCache(designSystem)
  designSystem.storage[STATIC_UTILITIES_KEY] ??= createStaticUtilitiesCache()
  designSystem.storage[UTILITY_PROPERTIES_KEY] ??= createUtilityPropertiesCache(designSystem)
  designSystem.storage[PRE_COMPUTED_UTILITIES_KEY] ??= createPreComputedUtilitiesCache(designSystem)
  designSystem.storage[VARIANT_SIGNATURE_KEY] ??= createVariantSignatureCache(designSystem)
  designSystem.storage[PRE_COMPUTED_VARIANTS_KEY] ??= createPreComputedVariantsCache(designSystem)

  return designSystem
}

const SIGNATURE_OPTIONS_KEY = Symbol()
function createSignatureOptionsCache(): DesignSystem['storage'][typeof SIGNATURE_OPTIONS_KEY] {
  return new DefaultMap((rem: number | null) => {
    return new DefaultMap((features: SignatureFeatures) => {
      return { rem, features } satisfies SignatureOptions
    })
  })
}

export function createSignatureOptions(
  baseDesignSystem: BaseDesignSystem,
  options?: CanonicalizeOptions,
): SignatureOptions {
  let features = SignatureFeatures.None
  if (options?.collapse) features |= SignatureFeatures.ExpandProperties
  if (options?.logicalToPhysical) features |= SignatureFeatures.LogicalToPhysical

  let designSystem = prepareDesignSystemStorage(baseDesignSystem)

  return designSystem.storage[SIGNATURE_OPTIONS_KEY].get(options?.rem ?? null).get(features)
}

const INTERNAL_OPTIONS_KEY = Symbol()
function createInternalOptionsCache(
  designSystem: DesignSystem,
): DesignSystem['storage'][typeof INTERNAL_OPTIONS_KEY] {
  return new DefaultMap((signatureOptions: SignatureOptions) => {
    return new DefaultMap((features: Features) => {
      return { features, designSystem, signatureOptions } satisfies InternalCanonicalizeOptions
    })
  })
}

function createCanonicalizeOptions(
  baseDesignSystem: BaseDesignSystem,
  signatureOptions: SignatureOptions,
  options?: CanonicalizeOptions,
) {
  let features = Features.None
  if (options?.collapse) features |= Features.CollapseUtilities

  let designSystem = prepareDesignSystemStorage(baseDesignSystem)

  return designSystem.storage[INTERNAL_OPTIONS_KEY].get(signatureOptions).get(features)
}

export function canonicalizeCandidates(
  baseDesignSystem: BaseDesignSystem,
  candidates: string[],
  options?: CanonicalizeOptions,
): string[] {
  let signatureOptions = createSignatureOptions(baseDesignSystem, options)
  let canonicalizeOptions = createCanonicalizeOptions(baseDesignSystem, signatureOptions, options)

  let designSystem = prepareDesignSystemStorage(baseDesignSystem)

  let result = new Set<string>()
  let cache = designSystem.storage[CANONICALIZE_CANDIDATE_KEY].get(canonicalizeOptions)
  for (let candidate of candidates) {
    result.add(cache.get(candidate))
  }

  return result.size <= 1 || !(canonicalizeOptions.features & Features.CollapseUtilities)
    ? Array.from(result)
    : collapseCandidates(canonicalizeOptions, Array.from(result))
}

function collapseCandidates(options: InternalCanonicalizeOptions, candidates: string[]): string[] {
  if (candidates.length <= 1) return candidates
  let designSystem = options.designSystem

  // To keep things simple, we group candidates such that we only collapse
  // candidates with the same variants and important modifier together.
  let groups = new DefaultMap((_before: string) => {
    return new DefaultMap((_after: string) => {
      return new Set<string>()
    })
  })

  let prefix = options.designSystem.theme.prefix ? `${options.designSystem.theme.prefix}:` : ''

  for (let candidate of candidates) {
    let variants = segment(candidate, ':')
    let utility = variants.pop()!

    let important = utility.endsWith('!')
    if (important) {
      utility = utility.slice(0, -1)
    }

    let before = variants.length > 0 ? `${variants.join(':')}:` : ''
    let after = important ? '!' : ''

    // Group by variants and important flag
    groups.get(before).get(after).add(`${prefix}${utility}`)
  }

  let result = new Set<string>()
  for (let [before, group] of groups.entries()) {
    for (let [after, candidates] of group.entries()) {
      for (let candidate of collapseGroup(Array.from(candidates))) {
        // Drop the prefix if we had one, because the prefix is already there as
        // part of the variants.
        if (prefix && candidate.startsWith(prefix)) {
          candidate = candidate.slice(prefix.length)
        }

        result.add(`${before}${candidate}${after}`)
      }
    }
  }

  return Array.from(result)

  function collapseGroup(candidates: string[]) {
    let signatureOptions = options.signatureOptions
    let computeUtilitiesPropertiesLookup =
      designSystem.storage[UTILITY_PROPERTIES_KEY].get(signatureOptions)
    let staticUtilities = designSystem.storage[STATIC_UTILITIES_KEY].get(signatureOptions)

    // For each candidate, compute the used properties and values. E.g.: `mt-1` → `margin-top` → `0.25rem`
    //
    // NOTE: Currently assuming we are dealing with static utilities only. This
    // will change the moment we have `@utility` for most built-ins.
    let candidatePropertiesValues = candidates.map((candidate) =>
      computeUtilitiesPropertiesLookup.get(candidate),
    )

    // For each property, lookup other utilities that also set this property and
    // this exact value. If multiple properties are used, use the intersection of
    // each property.
    //
    // E.g.: `margin-top` → `mt-1`, `my-1`, `m-1`
    let otherUtilities = candidatePropertiesValues.map((propertyValues) => {
      let result: Set<string> | null = null
      for (let [property, values] of propertyValues) {
        for (let value of values) {
          let otherUtilities = staticUtilities.get(property).get(value)

          if (result === null) result = new Set(otherUtilities)
          else result = intersection(result, otherUtilities)

          // The moment no other utilities match, we can stop searching because
          // all intersections with an empty set will remain empty.
          if (result!.size === 0) return result!
        }
      }
      return result!
    })

    // Link each candidate that could be linked via another utility
    // (intersection). This way we can reduce the amount of required combinations.
    //
    // E.g.: `mt-1` and `mb-1` can be linked via `my-1`.
    //
    // Candidates that cannot be linked won't be able to be collapsed.
    // E.g.: `mt-1` and `text-red-500` cannot be collapsed because there is no 3rd
    // utility with overlapping property/value combinations.
    let linked = new DefaultMap<number, Set<number>>((key) => new Set<number>([key]))
    let otherUtilitiesArray = Array.from(otherUtilities)
    for (let i = 0; i < otherUtilitiesArray.length; i++) {
      let current = otherUtilitiesArray[i]
      for (let j = i + 1; j < otherUtilitiesArray.length; j++) {
        let other = otherUtilitiesArray[j]

        for (let property of current) {
          if (other.has(property)) {
            linked.get(i).add(j)
            linked.get(j).add(i)

            // The moment we find a link, we can stop comparing and move on to the
            // next candidate. This will safe us some time
            break
          }
        }
      }
    }

    // Not a single candidate can be linked to another one, nothing left to do
    if (linked.size === 0) return candidates

    // Each candidate index will now have a set of other candidate indexes as
    // its value. Let's make the lists unique combinations so that we can
    // iterate over them.
    let uniqueCombinations = new DefaultMap((key: string) => key.split(',').map(Number))
    for (let group of linked.values()) {
      let sorted = Array.from(group).sort((a, b) => a - b)
      uniqueCombinations.get(sorted.join(','))
    }

    // Let's try to actually collapse them now.
    let result = new Set<string>(candidates)
    let drop = new Set<string>()

    for (let idxs of uniqueCombinations.values()) {
      for (let combo of combinations(idxs)) {
        if (combo.some((idx) => drop.has(candidates[idx]))) continue // Skip already dropped items

        let potentialReplacements = combo.flatMap((idx) => otherUtilities[idx]).reduce(intersection)

        let collapsedSignature = designSystem.storage[UTILITY_SIGNATURE_KEY].get(
          signatureOptions,
        ).get(
          combo
            .map((idx) => candidates[idx])
            .sort((a, z) => a.localeCompare(z)) // Sort to increase cache hits
            .join(' '),
        )

        for (let replacement of potentialReplacements) {
          let signature =
            designSystem.storage[UTILITY_SIGNATURE_KEY].get(signatureOptions).get(replacement)
          if (signature !== collapsedSignature) continue // Not a safe replacement

          // We can replace all items in the combo with the replacement
          for (let item of combo) {
            drop.add(candidates[item])
          }

          // Use the replacement
          result.add(replacement)
          break
        }
      }
    }

    for (let item of drop) {
      result.delete(item)
    }

    return Array.from(result)
  }
}

const CANONICALIZE_CANDIDATE_KEY = Symbol()
function createCanonicalizeCandidateCache(): DesignSystem['storage'][typeof CANONICALIZE_CANDIDATE_KEY] {
  return new DefaultMap((options: InternalCanonicalizeOptions) => {
    let ds = options.designSystem
    let prefix = ds.theme.prefix ? `${ds.theme.prefix}:` : ''
    let variantCache = ds.storage[CANONICALIZE_VARIANT_KEY].get(options)
    let utilityCache = ds.storage[CANONICALIZE_UTILITY_KEY].get(options)

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
}

type VariantCanonicalizationFunction = (
  variant: Variant,
  options: InternalCanonicalizeOptions,
) => Variant | Variant[]

const VARIANT_CANONICALIZATIONS: VariantCanonicalizationFunction[] = [
  themeToVarVariant,
  arbitraryValueToBareValueVariant,
  modernizeArbitraryValuesVariant,
  arbitraryVariants,
]

const CANONICALIZE_VARIANT_KEY = Symbol()
function createCanonicalizeVariantCache(): DesignSystem['storage'][typeof CANONICALIZE_VARIANT_KEY] {
  return new DefaultMap((options: InternalCanonicalizeOptions) => {
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
}

type UtilityCanonicalizationFunction = (
  candidate: Candidate,
  options: InternalCanonicalizeOptions,
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

const CANONICALIZE_UTILITY_KEY = Symbol()
function createCanonicalizeUtilityCache(): DesignSystem['storage'][typeof CANONICALIZE_UTILITY_KEY] {
  return new DefaultMap((options: InternalCanonicalizeOptions) => {
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
}

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

function themeToVarUtility(candidate: Candidate, options: InternalCanonicalizeOptions): Candidate {
  let convert = options.designSystem.storage[CONVERTER_KEY]

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

function themeToVarVariant(
  variant: Variant,
  options: InternalCanonicalizeOptions,
): Variant | Variant[] {
  let convert = options.designSystem.storage[CONVERTER_KEY]

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

const CONVERTER_KEY = Symbol()
function createConverterCache(
  designSystem: DesignSystem,
): DesignSystem['storage'][typeof CONVERTER_KEY] {
  return createConverter(designSystem)

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
}

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

const SPACING_KEY = Symbol()
function createSpacingCache(
  designSystem: DesignSystem,
): DesignSystem['storage'][typeof SPACING_KEY] {
  let spacingMultiplier = designSystem.resolveThemeValue('--spacing')
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
}

function arbitraryUtilities(candidate: Candidate, options: InternalCanonicalizeOptions): Candidate {
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
  let utilities = designSystem.storage[PRE_COMPUTED_UTILITIES_KEY].get(options.signatureOptions)
  let signatures = designSystem.storage[UTILITY_SIGNATURE_KEY].get(options.signatureOptions)

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

      // Try to canonicalize any incoming arbitrary value. Canonicalization of
      // `rem` and `px` values will be converted to `px`, so we have to
      // canonicalize the spacing multiplier as well.
      if (
        options.signatureOptions.rem !== null &&
        candidate.kind === 'functional' &&
        candidate.value?.kind === 'arbitrary'
      ) {
        let spacingMultiplier = designSystem.resolveThemeValue('--spacing')
        if (spacingMultiplier !== undefined) {
          // Canonicalizing the spacing multiplier allows us to handle both
          // `--spacing: 0.25rem` and `--spacing: 4px` values correctly.
          let canonicalizedSpacingMultiplier = constantFoldDeclaration(
            spacingMultiplier,
            options.signatureOptions.rem,
          )

          let canonicalizedValue = constantFoldDeclaration(value, options.signatureOptions.rem)
          let valueDimension = dimensions.get(canonicalizedValue)
          let spacingMultiplierDimension = dimensions.get(canonicalizedSpacingMultiplier)
          if (
            valueDimension &&
            spacingMultiplierDimension &&
            valueDimension[1] === spacingMultiplierDimension[1] && // Ensure the units match
            spacingMultiplierDimension[0] !== 0
          ) {
            let bareValue = `${valueDimension[0] / spacingMultiplierDimension[0]}`
            if (isValidSpacingMultiplier(bareValue)) {
              yield Object.assign({}, candidate, {
                value: { kind: 'named', value: bareValue, fraction: null },
              })
            }
          }
        }
      }

      let spacingMultiplier = designSystem.storage[SPACING_KEY]?.get(value) ?? null
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

function bareValueUtilities(candidate: Candidate, options: InternalCanonicalizeOptions): Candidate {
  // We are only interested in bare value utilities
  if (candidate.kind !== 'functional' || candidate.value?.kind !== 'named') {
    return candidate
  }

  let designSystem = options.designSystem
  let utilities = designSystem.storage[PRE_COMPUTED_UTILITIES_KEY].get(options.signatureOptions)
  let signatures = designSystem.storage[UTILITY_SIGNATURE_KEY].get(options.signatureOptions)

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

function deprecatedUtilities(
  candidate: Candidate,
  options: InternalCanonicalizeOptions,
): Candidate {
  let designSystem = options.designSystem
  let signatures = designSystem.storage[UTILITY_SIGNATURE_KEY].get(options.signatureOptions)

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

function arbitraryVariants(
  variant: Variant,
  options: InternalCanonicalizeOptions,
): Variant | Variant[] {
  let designSystem = options.designSystem
  let signatures = designSystem.storage[VARIANT_SIGNATURE_KEY]
  let variants = designSystem.storage[PRE_COMPUTED_VARIANTS_KEY]

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

function dropUnnecessaryDataTypes(
  candidate: Candidate,
  options: InternalCanonicalizeOptions,
): Candidate {
  let designSystem = options.designSystem
  let signatures = designSystem.storage[UTILITY_SIGNATURE_KEY].get(options.signatureOptions)

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
  options: InternalCanonicalizeOptions,
): Candidate {
  // We are only interested in functional utilities with arbitrary values
  if (candidate.kind !== 'functional' || candidate.value?.kind !== 'arbitrary') {
    return candidate
  }

  let designSystem = options.designSystem
  let signatures = designSystem.storage[UTILITY_SIGNATURE_KEY].get(options.signatureOptions)

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
  options: InternalCanonicalizeOptions,
): Variant | Variant[] {
  let result = [variant]
  let designSystem = options.designSystem
  let signatures = designSystem.storage[VARIANT_SIGNATURE_KEY]

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
        (isAttributeSelector(ast[2]) || ast[2].value[0] === ':')
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
        (isAttributeSelector(ast[2]) || ast[2].value[0] === ':')
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
        ) {
          continue
        }

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

        if (newVariant === null) {
          if (prefixedVariant) {
            replaceObject(variant, {
              kind: 'arbitrary',
              selector: target.value,
              relative: false,
            } satisfies Variant)

            return [prefixedVariant, variant]
          }

          continue
        }

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

        // Arbitrary attributes
        else {
          replaceObject(variant, {
            kind: 'arbitrary',
            selector: target.value,
            relative: false,
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
function optimizeModifier(candidate: Candidate, options: InternalCanonicalizeOptions): Candidate {
  // We are only interested in functional or arbitrary utilities with a modifier
  if (
    (candidate.kind !== 'functional' && candidate.kind !== 'arbitrary') ||
    candidate.modifier === null
  ) {
    return candidate
  }

  let designSystem = options.designSystem
  let signatures = designSystem.storage[UTILITY_SIGNATURE_KEY].get(options.signatureOptions)

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

export enum SignatureFeatures {
  None = 0,
  ExpandProperties = 1 << 0,
  LogicalToPhysical = 1 << 1,
}

interface SignatureOptions {
  /**
   * The root font size in pixels. If provided, `rem` values will be normalized
   * to `px` values.
   *
   * E.g.: `mt-[16px]` with `rem: 16` will become `mt-4` (assuming `--spacing: 0.25rem`).
   */
  rem: number | null

  /**
   * Features that influence how signatures are computed.
   */
  features: SignatureFeatures
}

// Given a utility, compute a signature that represents the utility. The
// signature will be a normalised form of the generated CSS for the utility, or
// a unique symbol if the utility is not valid. The class in the selector will
// be replaced with the `.x` selector.
//
// This function should only be passed the base utility so `flex`, `hover:flex`
// and `focus:flex` will all use just `flex`. Variants are handled separately.
//
// E.g.:
//
// | UTILITY          | GENERATED SIGNATURE     |
// | ---------------- | ----------------------- |
// | `[display:flex]` | `.x { display: flex; }` |
// | `flex`           | `.x { display: flex; }` |
//
// These produce the same signature, therefore they represent the same utility.
export const UTILITY_SIGNATURE_KEY = Symbol()
function createUtilitySignatureCache(
  designSystem: DesignSystem,
): DesignSystem['storage'][typeof UTILITY_SIGNATURE_KEY] {
  return new DefaultMap((options: SignatureOptions) => {
    return new DefaultMap<string, string | Symbol>((utility) => {
      try {
        // Ensure the prefix is added to the utility if it is not already present.
        utility =
          designSystem.theme.prefix && !utility.startsWith(designSystem.theme.prefix)
            ? `${designSystem.theme.prefix}:${utility}`
            : utility

        // Use `@apply` to normalize the selector to `.x`
        let ast: AstNode[] = [styleRule('.x', [atRule('@apply', utility)])]

        temporarilyDisableThemeInline(designSystem, () => {
          // There's separate utility caches for respect important vs not
          // so we want to compile them both with `@theme inline` disabled
          for (let candidate of designSystem.parseCandidate(utility)) {
            designSystem.compileAstNodes(candidate, CompileAstFlags.RespectImportant)
          }

          substituteAtApply(ast, designSystem)
        })

        // Optimize the AST. This is needed such that any internal intermediate
        // nodes are gone. This will also cleanup declaration nodes with undefined
        // values or `--tw-sort` declarations.
        canonicalizeAst(designSystem, ast, options)

        // Compute the final signature, by generating the CSS for the utility
        let signature = toCss(ast)
        return signature
      } catch {
        // A unique symbol is returned to ensure that 2 signatures resulting in
        // `null` are not considered equal.
        return Symbol()
      }
    })
  })
}

// Optimize the CSS AST to make it suitable for signature comparison. We want to
// expand declarations, ignore comments, sort declarations etc...
function canonicalizeAst(designSystem: DesignSystem, ast: AstNode[], options: SignatureOptions) {
  let { rem } = options

  walk(ast, {
    enter(node, ctx) {
      // Optimize declarations
      if (node.kind === 'declaration') {
        if (node.value === undefined || node.property === '--tw-sort') {
          return WalkAction.Replace([])
        }

        // Ignore `--tw-{property}` if `{property}` exists with the same value
        if (node.property.startsWith('--tw-')) {
          if (
            (ctx.parent?.nodes ?? []).some(
              (sibling) =>
                sibling.kind === 'declaration' &&
                node.value === sibling.value &&
                node.important === sibling.important &&
                !sibling.property.startsWith('--tw-'),
            )
          ) {
            return WalkAction.Replace([])
          }
        }

        if (options.features & SignatureFeatures.ExpandProperties) {
          let replacement = expandDeclaration(node, options.features)
          if (replacement) return WalkAction.Replace(replacement)
        }

        // Resolve theme values to their inlined value.
        if (node.value.includes('var(')) {
          node.value = resolveVariablesInValue(node.value, designSystem)
        }

        // Very basic `calc(…)` constant folding to handle the spacing scale
        // multiplier:
        //
        // Input:  `--spacing(4)`
        //       → `calc(var(--spacing, 0.25rem) * 4)`
        //       → `calc(0.25rem * 4)`       ← this is the case we will see
        //                                     after inlining the variable
        //       → `1rem`
        node.value = constantFoldDeclaration(node.value, rem)

        // We will normalize the `node.value`, this is the same kind of logic
        // we use when printing arbitrary values. It will remove unnecessary
        // whitespace.
        //
        // Essentially normalizing the `node.value` to a canonical form.
        node.value = printArbitraryValue(node.value)
      }

      // Replace special nodes with its children
      else if (node.kind === 'context' || node.kind === 'at-root') {
        return WalkAction.Replace(node.nodes)
      }

      // Remove comments
      else if (node.kind === 'comment') {
        return WalkAction.Replace([])
      }

      // Remove at-rules that are not needed for the signature
      else if (node.kind === 'at-rule' && node.name === '@property') {
        return WalkAction.Replace([])
      }
    },
    exit(node) {
      if (node.kind === 'rule' || node.kind === 'at-rule') {
        node.nodes.sort((a, b) => {
          if (a.kind !== 'declaration') return 0
          if (b.kind !== 'declaration') return 0
          return a.property.localeCompare(b.property)
        })
      }
    },
  })

  return ast
}

// Resolve theme values to their inlined value.
//
// E.g.:
//
// `[color:var(--color-red-500)]` → `[color:oklch(63.7%_0.237_25.331)]`
// `[color:oklch(63.7%_0.237_25.331)]` → `[color:oklch(63.7%_0.237_25.331)]`
//
// Due to the `@apply` from above, this will become:
//
// ```css
// .example {
//   color: oklch(63.7% 0.237 25.331);
// }
// ```
//
// Which conveniently will be equivalent to: `text-red-500` when we inline
// the value.
//
// Without inlining:
// ```css
// .example {
//   color: var(--color-red-500, oklch(63.7% 0.237 25.331));
// }
// ```
//
// Inlined:
// ```css
// .example {
//   color: oklch(63.7% 0.237 25.331);
// }
// ```
//
// Recently we made sure that utilities like `text-red-500` also generate
// the fallback value for usage in `@reference` mode.
//
// The second assumption is that if you use `var(--key, fallback)` that
// happens to match a known variable _and_ its inlined value. Then we can
// replace it with the inlined variable. This allows us to handle custom
// `@theme` and `@theme inline` definitions.
function resolveVariablesInValue(value: string, designSystem: DesignSystem): string {
  let changed = false
  let valueAst = ValueParser.parse(value)

  let seen = new Set<string>()
  walk(valueAst, (valueNode) => {
    if (valueNode.kind !== 'function') return
    if (valueNode.value !== 'var') return

    // Resolve the underlying value of the variable
    if (valueNode.nodes.length !== 1 && valueNode.nodes.length < 3) {
      return
    }

    let variable = valueNode.nodes[0].value

    // Drop the prefix from the variable name if it is present. The
    // internal variable doesn't have the prefix.
    if (designSystem.theme.prefix && variable.startsWith(`--${designSystem.theme.prefix}-`)) {
      variable = variable.slice(`--${designSystem.theme.prefix}-`.length)
    }
    let variableValue = designSystem.resolveThemeValue(variable)
    // Prevent infinite recursion when the variable value contains the
    // variable itself.
    if (seen.has(variable)) return
    seen.add(variable)
    if (variableValue === undefined) return // Couldn't resolve the variable

    // Inject variable fallbacks when no fallback is present yet.
    //
    // A fallback could consist of multiple values.
    //
    // E.g.:
    //
    // ```
    // var(--font-sans, ui-sans-serif, system-ui, sans-serif, …)
    // ```
    {
      // More than 1 argument means that a fallback is already present
      if (valueNode.nodes.length === 1) {
        // Inject the fallback value into the variable lookup
        changed = true
        valueNode.nodes.push(...ValueParser.parse(`,${variableValue}`))
      }
    }

    // Replace known variable + inlined fallback value with the value
    // itself again
    {
      // We need at least 3 arguments. The variable, the separator and a fallback value.
      if (valueNode.nodes.length >= 3) {
        let nodeAsString = ValueParser.toCss(valueNode.nodes) // This could include more than just the variable
        let constructedValue = `${valueNode.nodes[0].value},${variableValue}`
        if (nodeAsString === constructedValue) {
          changed = true
          return WalkAction.Replace(ValueParser.parse(variableValue))
        }
      }
    }
  })

  // Replace the value with the new value
  if (changed) return ValueParser.toCss(valueAst)
  return value
}

// Index all static utilities by property and value
const STATIC_UTILITIES_KEY = Symbol()
function createStaticUtilitiesCache(): DesignSystem['storage'][typeof STATIC_UTILITIES_KEY] {
  return new DefaultMap((_optiones: SignatureOptions) => {
    return new DefaultMap((_property: string) => {
      return new DefaultMap((_value: string) => {
        return new Set<string>()
      })
    })
  })
}

const UTILITY_PROPERTIES_KEY = Symbol()
function createUtilityPropertiesCache(
  designSystem: DesignSystem,
): DesignSystem['storage'][typeof UTILITY_PROPERTIES_KEY] {
  return new DefaultMap((options: SignatureOptions) => {
    return new DefaultMap((className) => {
      let localPropertyValueLookup = new DefaultMap((_property) => new Set<string>())

      if (designSystem.theme.prefix && !className.startsWith(designSystem.theme.prefix)) {
        className = `${designSystem.theme.prefix}:${className}`
      }
      let parsed = designSystem.parseCandidate(className)
      if (parsed.length === 0) return localPropertyValueLookup

      walk(
        canonicalizeAst(
          designSystem,
          designSystem.compileAstNodes(parsed[0]).map((x) => cloneAstNode(x.node)),
          options,
        ),
        (node) => {
          if (node.kind === 'declaration') {
            localPropertyValueLookup.get(node.property).add(node.value!)
            designSystem.storage[STATIC_UTILITIES_KEY].get(options)
              .get(node.property)
              .get(node.value!)
              .add(className)
          }
        },
      )

      return localPropertyValueLookup
    })
  })
}

// For all static utilities in the system, compute a lookup table that maps the
// utility signature to the utility name. This is used to find the utility name
// for a given utility signature.
//
// For all functional utilities, we can compute static-like utilities by
// essentially pre-computing the values and modifiers. This is a bit slow, but
// also only has to happen once per design system.
const PRE_COMPUTED_UTILITIES_KEY = Symbol()
function createPreComputedUtilitiesCache(
  designSystem: DesignSystem,
): DesignSystem['storage'][typeof PRE_COMPUTED_UTILITIES_KEY] {
  return new DefaultMap((options: SignatureOptions) => {
    let signatures = designSystem.storage[UTILITY_SIGNATURE_KEY].get(options)
    let lookup = new DefaultMap<string, string[]>(() => [])

    // Right now all plugins are implemented using functions so they are a black
    // box. Let's use the `getClassList` and consider every known suggestion as a
    // static utility for now.
    for (let [className, meta] of designSystem.getClassList()) {
      let signature = signatures.get(className)
      if (typeof signature !== 'string') continue

      // Skip the utility if `-{utility}-0` has the same signature as
      // `{utility}-0` (its positive version). This will prefer positive values
      // over negative values.
      if (className[0] === '-' && className.endsWith('-0')) {
        let positiveSignature = signatures.get(className.slice(1))
        if (typeof positiveSignature === 'string' && signature === positiveSignature) {
          continue
        }
      }

      lookup.get(signature).push(className)
      designSystem.storage[UTILITY_PROPERTIES_KEY].get(options).get(className)

      for (let modifier of meta.modifiers) {
        // Modifiers representing numbers can be computed and don't need to be
        // pre-computed. Doing the math and at the time of writing this, this
        // would save you 250k additionally pre-computed utilities...
        if (isValidSpacingMultiplier(modifier)) {
          continue
        }

        let classNameWithModifier = `${className}/${modifier}`
        let signature = signatures.get(classNameWithModifier)
        if (typeof signature !== 'string') continue
        lookup.get(signature).push(classNameWithModifier)
        designSystem.storage[UTILITY_PROPERTIES_KEY].get(options).get(classNameWithModifier)
      }
    }

    return lookup
  })
}

// Given a variant, compute a signature that represents the variant. The
// signature will be a normalised form of the generated CSS for the variant, or
// a unique symbol if the variant is not valid. The class in the selector will
// be replaced with `.x`.
//
// E.g.:
//
// | VARIANT          | GENERATED SIGNATURE           |
// | ---------------- | ----------------------------- |
// | `[&:focus]:flex` | `.x:focus { display: flex; }` |
// | `focus:flex`     | `.x:focus { display: flex; }` |
//
// These produce the same signature, therefore they represent the same variant.
export const VARIANT_SIGNATURE_KEY = Symbol()
function createVariantSignatureCache(
  designSystem: DesignSystem,
): DesignSystem['storage'][typeof VARIANT_SIGNATURE_KEY] {
  return new DefaultMap<string, string | Symbol>((variant) => {
    try {
      // Ensure the prefix is added to the utility if it is not already present.
      variant =
        designSystem.theme.prefix && !variant.startsWith(designSystem.theme.prefix)
          ? `${designSystem.theme.prefix}:${variant}`
          : variant

      // Use `@apply` to normalize the selector to `.x`
      let ast: AstNode[] = [styleRule('.x', [atRule('@apply', `${variant}:flex`)])]
      substituteAtApply(ast, designSystem)

      // Canonicalize selectors to their minimal form
      walk(ast, (node) => {
        // At-rules
        if (node.kind === 'at-rule' && node.params.includes(' ')) {
          node.params = node.params.replaceAll(' ', '')
        }

        // Style rules
        else if (node.kind === 'rule') {
          let selectorAst = SelectorParser.parse(node.selector)
          let changed = false
          walk(selectorAst, (node) => {
            if (node.kind === 'separator' && node.value !== ' ') {
              node.value = node.value.trim()
              changed = true
            }

            // Remove unnecessary `:is(…)` selectors
            else if (node.kind === 'function' && node.value === ':is') {
              // A single selector inside of `:is(…)` can be replaced with the
              // selector itself.
              //
              // E.g.: `:is(.foo)` → `.foo`
              if (node.nodes.length === 1) {
                changed = true
                return WalkAction.Replace(node.nodes)
              }

              // A selector with the universal selector `*` followed by a pseudo
              // class, can be replaced with the pseudo class itself.
              else if (
                node.nodes.length === 2 &&
                node.nodes[0].kind === 'selector' &&
                node.nodes[0].value === '*' &&
                node.nodes[1].kind === 'selector' &&
                node.nodes[1].value[0] === ':'
              ) {
                changed = true
                return WalkAction.Replace(node.nodes[1])
              }
            }

            // Ensure `*` exists before pseudo selectors inside of `:not(…)`,
            // `:where(…)`, …
            //
            // E.g.:
            //
            // `:not(:first-child)` → `:not(*:first-child)`
            //
            else if (
              node.kind === 'function' &&
              node.value[0] === ':' &&
              node.nodes[0]?.kind === 'selector' &&
              node.nodes[0]?.value[0] === ':'
            ) {
              changed = true
              node.nodes.unshift({ kind: 'selector', value: '*' })
            }
          })

          if (changed) {
            node.selector = SelectorParser.toCss(selectorAst)
          }
        }
      })

      // Compute the final signature, by generating the CSS for the variant
      let signature = toCss(ast)
      return signature
    } catch {
      // A unique symbol is returned to ensure that 2 signatures resulting in
      // `null` are not considered equal.
      return Symbol()
    }
  })
}

export const PRE_COMPUTED_VARIANTS_KEY = Symbol()
function createPreComputedVariantsCache(
  designSystem: DesignSystem,
): DesignSystem['storage'][typeof PRE_COMPUTED_VARIANTS_KEY] {
  let signatures = designSystem.storage[VARIANT_SIGNATURE_KEY]
  let lookup = new DefaultMap<string, string[]>(() => [])

  // Actual static variants
  for (let [root, variant] of designSystem.variants.entries()) {
    if (variant.kind === 'static') {
      let signature = signatures.get(root)
      if (typeof signature !== 'string') continue
      lookup.get(signature).push(root)
    }
  }

  return lookup
}

function temporarilyDisableThemeInline<T>(designSystem: DesignSystem, cb: () => T): T {
  // Turn off `@theme inline` feature such that `@theme` and `@theme inline` are
  // considered the same. The biggest motivation for this is referencing
  // variables in another namespace that happen to contain the same value as the
  // utility's own namespaces it is reading from.
  //
  // E.g.:
  //
  // The `max-w-*` utility doesn't read from the `--breakpoint-*` namespace.
  // But it does read from the `--container-*` namespace. It also happens to
  // be the case that `--breakpoint-md` and `--container-3xl` are the exact
  // same value.
  //
  // If you then use the `max-w-(--breakpoint-md)` utility, inlining the
  // variable would mean:
  //  - `max-w-(--breakpoint-md)` → `max-width: 48rem;` → `max-w-3xl`
  //  - `max-w-(--contianer-3xl)` → `max-width: 48rem;` → `max-w-3xl`
  //
  // Not inlining the variable would mean:
  // - `max-w-(--breakpoint-md)` → `max-width: var(--breakpoint-md);` → `max-w-(--breakpoint-md)`
  // - `max-w-(--container-3xl)` → `max-width: var(--container-3xl);` → `max-w-3xl`

  // @ts-expect-error We are monkey-patching a method that's considered private
  // in TypeScript
  let originalGet = designSystem.theme.values.get

  // Track all values with the inline option set, so we can restore them later.
  let restorableInlineOptions = new Set<{ options: ThemeOptions }>()

  // @ts-expect-error We are monkey-patching a method that's considered private
  // in TypeScript
  designSystem.theme.values.get = (key: string) => {
    // @ts-expect-error We are monkey-patching a method that's considered private
    // in TypeScript
    let value = originalGet.call(designSystem.theme.values, key)
    if (value === undefined) return value

    // Remove `inline` if it was set
    if (value.options & ThemeOptions.INLINE) {
      restorableInlineOptions.add(value)
      value.options &= ~ThemeOptions.INLINE
    }

    return value
  }

  try {
    // Run the callback with the `@theme inline` feature disabled
    return cb()
  } finally {
    // Restore the `@theme inline` to the original value
    // @ts-expect-error We are monkey-patching a method that's private
    designSystem.theme.values.get = originalGet

    // Re-add the `inline` option, in case future lookups are done
    for (let value of restorableInlineOptions) {
      value.options |= ThemeOptions.INLINE
    }
  }
}

// Generator that generates all combinations of the given set. Using a generator
// so we can stop early when we found a suitable combination.
//
// NOTE:
//
// 1. Yield biggest combinations first
// 2. Sets of size 1 and 0 are not yielded
function* combinations<T>(arr: T[]): Generator<T[]> {
  let n = arr.length
  let limit = 1n << BigInt(n)

  for (let k = n; k >= 2; k--) {
    let mask = (1n << BigInt(k)) - 1n

    while (mask < limit) {
      let out = []
      for (let i = 0; i < n; i++) {
        if ((mask >> BigInt(i)) & 1n) {
          out.push(arr[i])
        }
      }
      yield out

      // Gosper's hack:
      // - https://programmingforinsomniacs.blogspot.com/2018/03/gospers-hack-explained.html
      // - https://rosettacode.org/wiki/Gosper%27s_hack
      //
      // We need to generate the next mask in lexicographical order.
      let carry = mask & -mask
      let ripple = mask + carry
      mask = (((ripple ^ mask) >> 2n) / carry) | ripple
    }
  }
}

function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
  // @ts-expect-error Set.prototype.intersection is only available in Node.js v22+
  if (typeof a.intersection === 'function') return a.intersection(b)

  // Polyfill for environments that do not support Set.prototype.intersection yet
  if (a.size === 0 || b.size === 0) return new Set<T>()

  let result = new Set<T>(a)
  for (let item of b) {
    if (!result.has(item)) {
      result.delete(item)
    }
  }

  return result
}
