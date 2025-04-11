import type { DesignSystem } from './design-system'
import { decodeArbitraryValue } from './utils/decode-arbitrary-value'
import { isValidArbitrary } from './utils/is-valid-arbitrary'
import { segment } from './utils/segment'

const COLON = 0x3a
const DASH = 0x2d
const LOWER_A = 0x61
const LOWER_Z = 0x7a

type ArbitraryUtilityValue = {
  kind: 'arbitrary'

  /**
   * ```
   * bg-[color:var(--my-color)]
   *     ^^^^^
   *
   * bg-(color:--my-color)
   *     ^^^^^
   * ```
   */
  dataType: string | null

  /**
   * ```
   * bg-[#0088cc]
   *     ^^^^^^^
   *
   * bg-[var(--my_variable)]
   *     ^^^^^^^^^^^^^^^^^^
   *
   * bg-(--my_variable)
   *     ^^^^^^^^^^^^^^
   * ```
   */
  value: string
}

export type NamedUtilityValue = {
  kind: 'named'

  /**
   * ```
   * bg-red-500
   *    ^^^^^^^
   *
   * w-1/2
   *   ^
   * ```
   */
  value: string

  /**
   * ```
   * w-1/2
   *   ^^^
   * ```
   */
  fraction: string | null
}

type ArbitraryModifier = {
  kind: 'arbitrary'

  /**
   * ```
   * bg-red-500/[50%]
   *             ^^^
   * ```
   */
  value: string
}

type NamedModifier = {
  kind: 'named'

  /**
   * ```
   * bg-red-500/50
   *            ^^
   * ```
   */
  value: string
}

export type CandidateModifier = ArbitraryModifier | NamedModifier

type ArbitraryVariantValue = {
  kind: 'arbitrary'
  value: string
}

type NamedVariantValue = {
  kind: 'named'
  value: string
}

export type Variant =
  /**
   * Arbitrary variants are variants that take a selector and generate a variant
   * on the fly.
   *
   * E.g.: `[&_p]`
   */
  | {
      kind: 'arbitrary'
      selector: string

      // Whether or not the selector is a relative selector
      // @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selector_structure#relative_selector
      relative: boolean
    }

  /**
   * Static variants are variants that don't take any arguments.
   *
   * E.g.: `hover`
   */
  | {
      kind: 'static'
      root: string
    }

  /**
   * Functional variants are variants that can take an argument. The argument is
   * either a named variant value or an arbitrary variant value.
   *
   * E.g.:
   *
   * - `aria-disabled`
   * - `aria-[disabled]`
   * - `@container-size`          -> @container, with named value `size`
   * - `@container-[inline-size]` -> @container, with arbitrary variant value `inline-size`
   * - `@container`               -> @container, with no value
   */
  | {
      kind: 'functional'
      root: string
      value: ArbitraryVariantValue | NamedVariantValue | null
      modifier: ArbitraryModifier | NamedModifier | null
    }

  /**
   * Compound variants are variants that take another variant as an argument.
   *
   * E.g.:
   *
   * - `has-[&_p]`
   * - `group-*`
   * - `peer-*`
   */
  | {
      kind: 'compound'
      root: string
      modifier: ArbitraryModifier | NamedModifier | null
      variant: Variant
    }

export type Candidate =
  /**
   * Arbitrary candidates are candidates that register utilities on the fly with
   * a property and a value.
   *
   * E.g.:
   *
   * - `[color:red]`
   * - `[color:red]/50`
   * - `[color:red]/50!`
   */
  | {
      kind: 'arbitrary'
      property: string
      value: string
      modifier: ArbitraryModifier | NamedModifier | null
      variants: Variant[]
      important: boolean
      raw: string
    }

  /**
   * Static candidates are candidates that don't take any arguments.
   *
   * E.g.:
   *
   * - `underline`
   * - `box-border`
   */
  | {
      kind: 'static'
      root: string
      variants: Variant[]
      important: boolean
      raw: string
    }

  /**
   * Functional candidates are candidates that can take an argument.
   *
   * E.g.:
   *
   * - `bg-red-500`
   * - `bg-[#0088cc]`
   * - `w-1/2`
   */
  | {
      kind: 'functional'
      root: string
      value: ArbitraryUtilityValue | NamedUtilityValue | null
      modifier: ArbitraryModifier | NamedModifier | null
      variants: Variant[]
      important: boolean
      raw: string
    }

export function* parseCandidate(input: string, designSystem: DesignSystem): Iterable<Candidate> {
  // hover:focus:underline
  // ^^^^^ ^^^^^^           -> Variants
  //             ^^^^^^^^^  -> Base
  let rawVariants = segment(input, ':')

  // A prefix is a special variant used to prefix all utilities. When present,
  // all utilities must start with that variant which we will then remove from
  // the variant list so no other part of the codebase has to know about it.
  if (designSystem.theme.prefix) {
    if (rawVariants.length === 1) return null
    if (rawVariants[0] !== designSystem.theme.prefix) return null

    rawVariants.shift()
  }

  // Safety: At this point it is safe to use TypeScript's non-null assertion
  // operator because even if the `input` was an empty string, splitting an
  // empty string by `:` will always result in an array with at least one
  // element.
  let base = rawVariants.pop()!

  let parsedCandidateVariants: Variant[] = []

  for (let i = rawVariants.length - 1; i >= 0; --i) {
    let parsedVariant = designSystem.parseVariant(rawVariants[i])
    if (parsedVariant === null) return

    parsedCandidateVariants.push(parsedVariant)
  }

  let important = false

  // Candidates that end with an exclamation mark are the important version with
  // higher specificity of the non-important candidate, e.g. `mx-4!`.
  if (base[base.length - 1] === '!') {
    important = true
    base = base.slice(0, -1)
  }

  // Legacy syntax with leading `!`, e.g. `!mx-4`.
  else if (base[0] === '!') {
    important = true
    base = base.slice(1)
  }

  // Check for an exact match of a static utility first as long as it does not
  // look like an arbitrary value.
  if (designSystem.utilities.has(base, 'static') && !base.includes('[')) {
    yield {
      kind: 'static',
      root: base,
      variants: parsedCandidateVariants,
      important,
      raw: input,
    }
  }

  // Figure out the new base and the modifier segment if present.
  //
  // E.g.:
  //
  // ```
  // bg-red-500/50
  // ^^^^^^^^^^    -> Base without modifier
  //            ^^ -> Modifier segment
  // ```
  let [baseWithoutModifier, modifierSegment = null, additionalModifier] = segment(base, '/')

  // If there's more than one modifier, the utility is invalid.
  //
  // E.g.:
  //
  // - `bg-red-500/50/50`
  if (additionalModifier) return

  let parsedModifier = modifierSegment === null ? null : parseModifier(modifierSegment)

  // Empty arbitrary values are invalid. E.g.: `[color:red]/[]` or `[color:red]/()`.
  //                                                        ^^                  ^^
  //                                           `bg-[#0088cc]/[]` or `bg-[#0088cc]/()`.
  //                                                         ^^                   ^^
  if (modifierSegment !== null && parsedModifier === null) return

  // Arbitrary properties
  if (baseWithoutModifier[0] === '[') {
    // Arbitrary properties should end with a `]`.
    if (baseWithoutModifier[baseWithoutModifier.length - 1] !== ']') return

    // The property part of the arbitrary property can only start with a-z
    // lowercase or a dash `-` in case of vendor prefixes such as `-webkit-`
    // or `-moz-`.
    //
    // Otherwise, it is an invalid candidate, and skip continue parsing.
    let charCode = baseWithoutModifier.charCodeAt(1)
    if (charCode !== DASH && !(charCode >= LOWER_A && charCode <= LOWER_Z)) {
      return
    }

    baseWithoutModifier = baseWithoutModifier.slice(1, -1)

    // Arbitrary properties consist of a property and a value separated by a
    // `:`. If the `:` cannot be found, then it is an invalid candidate, and we
    // can skip continue parsing.
    //
    // Since the property and the value should be separated by a `:`, we can
    // also verify that the colon is not the first or last character in the
    // candidate, because that would make it invalid as well.
    let idx = baseWithoutModifier.indexOf(':')
    if (idx === -1 || idx === 0 || idx === baseWithoutModifier.length - 1) return

    let property = baseWithoutModifier.slice(0, idx)
    let value = decodeArbitraryValue(baseWithoutModifier.slice(idx + 1))

    // Values can't contain `;` or `}` characters at the top-level.
    if (!isValidArbitrary(value)) return

    yield {
      kind: 'arbitrary',
      property,
      value,
      modifier: parsedModifier,
      variants: parsedCandidateVariants,
      important,
      raw: input,
    }

    return
  }

  // The different "versions"" of a candidate that are utilities
  // e.g. `['bg', 'red-500']` and `['bg-red', '500']`
  let roots: Iterable<Root>

  // If the base of the utility ends with a `]`, then we know it's an arbitrary
  // value. This also means that everything before the `[…]` part should be the
  // root of the utility.
  //
  // E.g.:
  //
  // ```
  // bg-[#0088cc]
  // ^^           -> Root
  //    ^^^^^^^^^ -> Arbitrary value
  //
  // border-l-[#0088cc]
  // ^^^^^^^^           -> Root
  //          ^^^^^^^^^ -> Arbitrary value
  // ```
  if (baseWithoutModifier[baseWithoutModifier.length - 1] === ']') {
    let idx = baseWithoutModifier.indexOf('-[')
    if (idx === -1) return

    let root = baseWithoutModifier.slice(0, idx)

    // The root of the utility should exist as-is in the utilities map. If not,
    // it's an invalid utility and we can skip continue parsing.
    if (!designSystem.utilities.has(root, 'functional')) return

    let value = baseWithoutModifier.slice(idx + 1)

    roots = [[root, value]]
  }

  // If the base of the utility ends with a `)`, then we know it's an arbitrary
  // value that encapsulates a CSS variable. This also means that everything
  // before the `(…)` part should be the root of the utility.
  //
  // E.g.:
  //
  // bg-(--my-var)
  // ^^            -> Root
  //    ^^^^^^^^^^ -> Arbitrary value
  // ```
  else if (baseWithoutModifier[baseWithoutModifier.length - 1] === ')') {
    let idx = baseWithoutModifier.indexOf('-(')
    if (idx === -1) return

    let root = baseWithoutModifier.slice(0, idx)

    // The root of the utility should exist as-is in the utilities map. If not,
    // it's an invalid utility and we can skip continue parsing.
    if (!designSystem.utilities.has(root, 'functional')) return

    let value = baseWithoutModifier.slice(idx + 2, -1)

    let parts = segment(value, ':')

    let dataType = null
    if (parts.length === 2) {
      dataType = parts[0]
      value = parts[1]
    }

    // An arbitrary value with `(…)` should always start with `--` since it
    // represents a CSS variable.
    if (value[0] !== '-' && value[1] !== '-') return

    roots = [[root, dataType === null ? `[var(${value})]` : `[${dataType}:var(${value})]`]]
  }

  // Not an arbitrary value
  else {
    roots = findRoots(baseWithoutModifier, (root: string) => {
      return designSystem.utilities.has(root, 'functional')
    })
  }

  for (let [root, value] of roots) {
    let candidate: Candidate = {
      kind: 'functional',
      root,
      modifier: parsedModifier,
      value: null,
      variants: parsedCandidateVariants,
      important,
      raw: input,
    }

    if (value === null) {
      yield candidate
      continue
    }

    {
      let startArbitraryIdx = value.indexOf('[')
      let valueIsArbitrary = startArbitraryIdx !== -1

      if (valueIsArbitrary) {
        // Arbitrary values must end with a `]`.
        if (value[value.length - 1] !== ']') return

        let arbitraryValue = decodeArbitraryValue(value.slice(startArbitraryIdx + 1, -1))

        // Values can't contain `;` or `}` characters at the top-level.
        if (!isValidArbitrary(arbitraryValue)) continue

        // Extract an explicit typehint if present, e.g. `bg-[color:var(--my-var)])`
        let typehint = ''
        for (let i = 0; i < arbitraryValue.length; i++) {
          let code = arbitraryValue.charCodeAt(i)

          // If we hit a ":", we're at the end of a typehint.
          if (code === COLON) {
            typehint = arbitraryValue.slice(0, i)
            arbitraryValue = arbitraryValue.slice(i + 1)
            break
          }

          // Keep iterating as long as we've only seen valid typehint characters.
          if (code === DASH || (code >= LOWER_A && code <= LOWER_Z)) {
            continue
          }

          // If we see any other character, there's no typehint so break early.
          break
        }

        // Empty arbitrary values are invalid. E.g.: `p-[]`
        //                                              ^^
        if (arbitraryValue.length === 0 || arbitraryValue.trim().length === 0) {
          continue
        }

        candidate.value = {
          kind: 'arbitrary',
          dataType: typehint || null,
          value: arbitraryValue,
        }
      } else {
        // Some utilities support fractions as values, e.g. `w-1/2`. Since it's
        // ambiguous whether the slash signals a modifier or not, we store the
        // fraction separately in case the utility matcher is interested in it.
        let fraction =
          modifierSegment === null || candidate.modifier?.kind === 'arbitrary'
            ? null
            : `${value}/${modifierSegment}`

        candidate.value = {
          kind: 'named',
          value,
          fraction,
        }
      }
    }

    yield candidate
  }
}

function parseModifier(modifier: string): CandidateModifier | null {
  if (modifier[0] === '[' && modifier[modifier.length - 1] === ']') {
    let arbitraryValue = decodeArbitraryValue(modifier.slice(1, -1))

    // Values can't contain `;` or `}` characters at the top-level.
    if (!isValidArbitrary(arbitraryValue)) return null

    // Empty arbitrary values are invalid. E.g.: `data-[]:`
    //                                                 ^^
    if (arbitraryValue.length === 0 || arbitraryValue.trim().length === 0) return null

    return {
      kind: 'arbitrary',
      value: arbitraryValue,
    }
  }

  if (modifier[0] === '(' && modifier[modifier.length - 1] === ')') {
    let arbitraryValue = decodeArbitraryValue(modifier.slice(1, -1))

    // Values can't contain `;` or `}` characters at the top-level.
    if (!isValidArbitrary(arbitraryValue)) return null

    // Empty arbitrary values are invalid. E.g.: `data-():`
    //                                                 ^^
    if (arbitraryValue.length === 0 || arbitraryValue.trim().length === 0) return null

    // Arbitrary values must start with `--` since it represents a CSS variable.
    if (arbitraryValue[0] !== '-' && arbitraryValue[1] !== '-') return null

    return {
      kind: 'arbitrary',
      value: `var(${arbitraryValue})`,
    }
  }

  return {
    kind: 'named',
    value: modifier,
  }
}

export function parseVariant(variant: string, designSystem: DesignSystem): Variant | null {
  // Arbitrary variants
  if (variant[0] === '[' && variant[variant.length - 1] === ']') {
    /**
     * TODO: Breaking change
     *
     * @deprecated Arbitrary variants containing at-rules with other selectors
     * are deprecated. Use stacked variants instead.
     *
     * Before:
     *  - `[@media(width>=123px){&:hover}]:`
     *
     * After:
     *  - `[@media(width>=123px)]:[&:hover]:`
     *  - `[@media(width>=123px)]:hover:`
     */
    if (variant[1] === '@' && variant.includes('&')) return null

    let selector = decodeArbitraryValue(variant.slice(1, -1))

    // Values can't contain `;` or `}` characters at the top-level.
    if (!isValidArbitrary(selector)) return null

    // Empty arbitrary values are invalid. E.g.: `[]:`
    //                                            ^^
    if (selector.length === 0 || selector.trim().length === 0) return null

    let relative = selector[0] === '>' || selector[0] === '+' || selector[0] === '~'

    // Ensure `&` is always present by wrapping the selector in `&:is(…)`,
    // unless it's a relative selector like `> img`.
    //
    // E.g.:
    //
    // - `[p]:flex`
    if (!relative && selector[0] !== '@' && !selector.includes('&')) {
      selector = `&:is(${selector})`
    }

    return {
      kind: 'arbitrary',
      selector,
      relative,
    }
  }

  // Static, functional and compound variants
  {
    // group-hover/group-name
    // ^^^^^^^^^^^            -> Variant without modifier
    //             ^^^^^^^^^^ -> Modifier
    let [variantWithoutModifier, modifier = null, additionalModifier] = segment(variant, '/')

    // If there's more than one modifier, the variant is invalid.
    //
    // E.g.:
    //
    // - `group-hover/foo/bar`
    if (additionalModifier) return null

    let roots = findRoots(variantWithoutModifier, (root) => {
      return designSystem.variants.has(root)
    })

    for (let [root, value] of roots) {
      switch (designSystem.variants.kind(root)) {
        case 'static': {
          // Static variants do not have a value
          if (value !== null) return null

          // Static variants do not have a modifier
          if (modifier !== null) return null

          return {
            kind: 'static',
            root,
          }
        }

        case 'functional': {
          let parsedModifier = modifier === null ? null : parseModifier(modifier)
          // Empty arbitrary values are invalid. E.g.: `@max-md/[]:` or `@max-md/():`
          //                                                    ^^               ^^
          if (modifier !== null && parsedModifier === null) return null

          if (value === null) {
            return {
              kind: 'functional',
              root,
              modifier: parsedModifier,
              value: null,
            }
          }

          if (value[value.length - 1] === ']') {
            // Discard values like `foo-[#bar]`
            if (value[0] !== '[') continue

            let arbitraryValue = decodeArbitraryValue(value.slice(1, -1))

            // Values can't contain `;` or `}` characters at the top-level.
            if (!isValidArbitrary(arbitraryValue)) return null

            // Empty arbitrary values are invalid. E.g.: `data-[]:`
            //                                                 ^^
            if (arbitraryValue.length === 0 || arbitraryValue.trim().length === 0) return null

            return {
              kind: 'functional',
              root,
              modifier: parsedModifier,
              value: {
                kind: 'arbitrary',
                value: arbitraryValue,
              },
            }
          }

          if (value[value.length - 1] === ')') {
            // Discard values like `foo-(--bar)`
            if (value[0] !== '(') continue

            let arbitraryValue = decodeArbitraryValue(value.slice(1, -1))

            // Values can't contain `;` or `}` characters at the top-level.
            if (!isValidArbitrary(arbitraryValue)) return null

            // Empty arbitrary values are invalid. E.g.: `data-():`
            //                                                 ^^
            if (arbitraryValue.length === 0 || arbitraryValue.trim().length === 0) return null

            // Arbitrary values must start with `--` since it represents a CSS variable.
            if (arbitraryValue[0] !== '-' && arbitraryValue[1] !== '-') return null

            return {
              kind: 'functional',
              root,
              modifier: parsedModifier,
              value: {
                kind: 'arbitrary',
                value: `var(${arbitraryValue})`,
              },
            }
          }

          return {
            kind: 'functional',
            root,
            modifier: parsedModifier,
            value: { kind: 'named', value },
          }
        }

        case 'compound': {
          if (value === null) return null

          let subVariant = designSystem.parseVariant(value)
          if (subVariant === null) return null

          // These two variants must be compatible when compounded
          if (!designSystem.variants.compoundsWith(root, subVariant)) return null

          let parsedModifier = modifier === null ? null : parseModifier(modifier)
          // Empty arbitrary values are invalid. E.g.: `group-focus/[]:` or `group-focus/():`
          //                                                        ^^                   ^^
          if (modifier !== null && parsedModifier === null) return null

          return {
            kind: 'compound',
            root,
            modifier: parsedModifier,
            variant: subVariant,
          }
        }
      }
    }
  }

  return null
}

type Root = [
  // The root of the utility, e.g.: `bg-red-500`
  //                                 ^^
  root: string,

  // The value of the utility, e.g.: `bg-red-500`
  //                                     ^^^^^^^
  value: string | null,
]

function* findRoots(input: string, exists: (input: string) => boolean): Iterable<Root> {
  // If there is an exact match, then that's the root.
  if (exists(input)) {
    yield [input, null]
  }

  // Otherwise test every permutation of the input by iteratively removing
  // everything after the last dash.
  let idx = input.lastIndexOf('-')

  // Determine the root and value by testing permutations of the incoming input.
  //
  // In case of a candidate like `bg-red-500`, this looks like:
  //
  // `bg-red-500` -> No match
  // `bg-red`     -> No match
  // `bg`         -> Match
  while (idx > 0) {
    let maybeRoot = input.slice(0, idx)

    if (exists(maybeRoot)) {
      let root: Root = [maybeRoot, input.slice(idx + 1)]

      // If the leftover value is an empty string, it means that the value is an
      // invalid named value, e.g.: `bg-`. This makes the candidate invalid and we
      // can skip any further parsing.
      if (root[1] === '') break

      yield root
    }

    idx = input.lastIndexOf('-', idx - 1)
  }

  // Try '@' variant after permutations. This allows things like `@max` of `@max-foo-bar`
  // to match before looking for `@`.
  if (input[0] === '@' && exists('@')) {
    yield ['@', input.slice(1)]
  }
}
