import { decodeArbitraryValue } from './utils/decode-arbitrary-value'
import { segment } from './utils/segment'

type ArbitraryUtilityValue = {
  kind: 'arbitrary'

  /**
   * bg-[color:--my-color]
   *     ^^^^^
   */
  dataType: string | null

  /**
   * bg-[#0088cc]
   *     ^^^^^^^
   * bg-[--my_variable]
   * var(^^^^^^^^^^^^^)
   */
  value: string

  /**
   * bg-[--my_variable]
   *     ^^^^^^^^^^^^^
   */
  dashedIdent: string | null
}

export type NamedUtilityValue = {
  kind: 'named'

  /**
   * bg-red-500
   *    ^^^^^^^
   *
   * w-1/2
   *   ^
   */
  value: string

  /**
   * w-1/2
   *   ^^^
   */
  fraction: string | null
}

type ArbitraryModifier = {
  kind: 'arbitrary'

  /**
   * bg-red-500/[50%]
   *             ^^^
   */
  value: string

  /**
   * bg-red-500/[--my_variable]
   *             ^^^^^^^^^^^^^
   */
  dashedIdent: string | null
}

type NamedModifier = {
  kind: 'named'

  /**
   * bg-red-500/50
   *            ^^
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

      // If true, it can be applied as a child of a compound variant
      compounds: boolean
    }

  /**
   * Static variants are variants that don't take any arguments.
   *
   * E.g.: `hover`
   */
  | {
      kind: 'static'
      root: string

      // If true, it can be applied as a child of a compound variant
      compounds: boolean
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

      // If true, it can be applied as a child of a compound variant
      compounds: boolean
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

      // If true, it can be applied as a child of a compound variant
      compounds: boolean
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
    }

  /**
   * Static candidates are candidates that don't take any arguments.
   *
   * E.g.:
   *
   * - `underline`
   * - `flex`
   */
  | {
      kind: 'static'
      root: string
      variants: Variant[]
      negative: boolean
      important: boolean
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
      negative: boolean
      important: boolean
    }

export function parseCandidate(
  input: string,
  utilities: {
    has: (value: string) => boolean
    kind: (root: string) => Omit<Candidate['kind'], 'arbitrary'>
  },
  parsedVariants: { get: (value: string) => Variant | null },
): Candidate | null {
  // hover:focus:underline
  // ^^^^^ ^^^^^^           -> Variants
  //             ^^^^^^^^^  -> Base
  let rawVariants = segment(input, ':')

  // Safety: At this point it is safe to use TypeScript's non-null assertion
  // operator because even if the `input` was an empty string, splitting an
  // empty string by `:` will always result in an array with at least one
  // element.
  let base = rawVariants.pop()!

  let parsedCandidateVariants: Variant[] = []

  for (let variant of rawVariants) {
    let parsedVariant = parsedVariants.get(variant)
    if (parsedVariant === null) return null

    // Variants are applied left-to-right meaning that any representing pseudo-
    // elements must come first. This is because they cannot have anything
    // after them in a selector. The problem with this is that it's common for
    // users to write them in the wrong order, for example:
    //
    // `dark:before:underline` (wrong)
    // `before:dark:underline` (right)
    //
    // Add pseudo-element variants to the front, making both examples above
    // function identically which allows users to not care about the order.
    switch (variant) {
      case 'after':
      case 'backdrop':
      case 'before':
      case 'first-letter':
      case 'first-line':
      case 'marker':
      case 'placeholder':
      case 'selection':
        parsedCandidateVariants.unshift(parsedVariant)
        break
      default:
        parsedCandidateVariants.push(parsedVariant)
    }
  }

  let state = {
    important: false,
    negative: false,
  }

  // Candidates that end with an exclamation mark are the important version with
  // higher specificity of the non-important candidate, e.g. `mx-4!`.
  if (base[base.length - 1] === '!') {
    state.important = true
    base = base.slice(0, -1)
  }

  // Legacy syntax with leading `!`, e.g. `!mx-4`.
  else if (base[0] === '!') {
    state.important = true
    base = base.slice(1)
  }

  // Arbitrary properties
  if (base[0] === '[') {
    let [baseWithoutModifier, modifierSegment = null] = segment(base, '/')
    if (baseWithoutModifier[baseWithoutModifier.length - 1] !== ']') return null

    // The property part of the arbitrary property can only start with a-z
    // lowercase or a dash `-` in case of vendor prefixes such as `-webkit-`
    // or `-moz-`.
    //
    // Otherwise, it is an invalid candidate, and skip continue parsing.
    let charCode = baseWithoutModifier.charCodeAt(1)
    if (charCode !== 45 && !(charCode >= 97 && charCode <= 122)) return null

    baseWithoutModifier = baseWithoutModifier.slice(1, -1)

    // Arbitrary properties consist of a property and a value separated by a
    // `:`. If the `:` cannot be found, then it is an invalid candidate, and we
    // can skip continue parsing.
    //
    // Since the property and the value should be separated by a `:`, we can
    // also verify that the colon is not the first or last character in the
    // candidate, because that would make it invalid as well.
    let idx = baseWithoutModifier.indexOf(':')
    if (idx === -1 || idx === 0 || idx === baseWithoutModifier.length - 1) return null

    let property = baseWithoutModifier.slice(0, idx)
    let value = decodeArbitraryValue(baseWithoutModifier.slice(idx + 1))

    return {
      kind: 'arbitrary',
      property,
      value,
      modifier: modifierSegment === null ? null : parseModifier(modifierSegment),
      variants: parsedCandidateVariants,
      important: state.important,
    }
  }

  // Candidates that start with a dash are the negative versions of another
  // candidate, e.g. `-mx-4`.
  if (base[0] === '-') {
    state.negative = true
    base = base.slice(1)
  }

  let [root, value] = findRoot(base, utilities)

  let modifierSegment: string | null = null

  // If the root is null, but it contains a `/`, then it could be that we are
  // dealing with a functional utility that contains a modifier but doesn't
  // contain a value.
  //
  // E.g.: `@container/parent`
  if (root === null && base.includes('/')) {
    let [rootWithoutModifier, rootModifierSegment = null] = segment(base, '/')

    modifierSegment = rootModifierSegment

    // Try to find the root and value, without the modifier present
    ;[root, value] = findRoot(rootWithoutModifier, utilities)
  }

  // If there's no root, the candidate isn't a valid class and can be discarded.
  if (root === null) return null

  let kind = utilities.kind(root)

  if (kind === 'static') {
    if (value !== null) return null

    return {
      kind: 'static',
      root,
      variants: parsedCandidateVariants,
      negative: state.negative,
      important: state.important,
    }
  }

  let candidate: Candidate = {
    kind: 'functional',
    root,
    modifier: modifierSegment === null ? null : parseModifier(modifierSegment),
    value: null,
    variants: parsedCandidateVariants,
    negative: state.negative,
    important: state.important,
  }

  if (value === null) return candidate

  {
    // Extract a modifier if present, e.g. `text-xl/9` or `bg-red-500/[14%]`
    let [valueWithoutModifier, modifierSegment = null] = segment(value, '/')

    if (modifierSegment !== null) {
      candidate.modifier = parseModifier(modifierSegment)
    }

    let startArbitraryIdx = valueWithoutModifier.indexOf('[')
    let valueIsArbitrary = startArbitraryIdx !== -1

    if (valueIsArbitrary) {
      let arbitraryValue = valueWithoutModifier.slice(startArbitraryIdx + 1, -1)

      // Extract an explicit typehint if present, e.g. `bg-[color:var(--my-var)])`
      let typehint = ''
      for (let i = 0; i < arbitraryValue.length; i++) {
        let code = arbitraryValue.charCodeAt(i)

        // If we hit a ":", we're at the end of a typehint.
        if (code === 58 /* ':' */) {
          typehint = arbitraryValue.slice(0, i)
          arbitraryValue = arbitraryValue.slice(i + 1)
          break
        }

        // Keep iterating as long as we've only seen valid typehint characters.
        if (code === 45 /* '-' */ || (code >= 97 && code <= 122) /* [a-z] */) {
          continue
        }

        // If we see any other character, there's no typehint so break early.
        break
      }

      // If an arbitrary value looks like a CSS variable, we automatically wrap
      // it with `var(...)`.
      //
      // But since some CSS properties accept a `<dashed-ident>` as a value
      // directly (e.g. `scroll-timeline-name`), we also store the original
      // value in case the utility matcher is interested in it without
      // `var(...)`.
      let dashedIdent: string | null = null
      if (arbitraryValue[0] === '-' && arbitraryValue[1] === '-') {
        dashedIdent = arbitraryValue
        arbitraryValue = `var(${arbitraryValue})`
      } else {
        arbitraryValue = decodeArbitraryValue(arbitraryValue)
      }

      candidate.value = {
        kind: 'arbitrary',
        dataType: typehint || null,
        value: arbitraryValue,
        dashedIdent,
      }
    } else {
      // Some utilities support fractions as values, e.g. `w-1/2`. Since it's
      // ambiguous whether the slash signals a modifier or not, we store the
      // fraction separately in case the utility matcher is interested in it.
      let fraction =
        modifierSegment === null || candidate.modifier?.kind === 'arbitrary'
          ? null
          : value.slice(valueWithoutModifier.lastIndexOf('-') + 1)

      candidate.value = {
        kind: 'named',
        value: valueWithoutModifier,
        fraction,
      }
    }
  }

  return candidate
}

function parseModifier(modifier: string): CandidateModifier {
  if (modifier[0] === '[' && modifier[modifier.length - 1] === ']') {
    let arbitraryValue = modifier.slice(1, -1)

    // If an arbitrary value looks like a CSS variable, we automatically wrap
    // it with `var(...)`.
    //
    // But since some CSS properties accept a `<dashed-ident>` as a value
    // directly (e.g. `scroll-timeline-name`), we also store the original
    // value in case the utility matcher is interested in it without
    // `var(...)`.
    let dashedIdent: string | null = null
    if (arbitraryValue[0] === '-' && arbitraryValue[1] === '-') {
      dashedIdent = arbitraryValue
      arbitraryValue = `var(${arbitraryValue})`
    } else {
      arbitraryValue = decodeArbitraryValue(arbitraryValue)
    }

    return {
      kind: 'arbitrary',
      value: arbitraryValue,
      dashedIdent,
    }
  }

  return {
    kind: 'named',
    value: modifier,
  }
}

export function parseVariant(
  variant: string,
  variants: {
    has: (value: string) => boolean
    kind: (root: string) => Omit<Variant['kind'], 'arbitrary'>
    compounds: (root: string) => boolean
  },
  parsedVariants: { get: (value: string) => Variant | null },
): Variant | null {
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

    if (selector[0] !== '@') {
      // Ensure `&` is always present by wrapping the selector in `&:is(…)`
      //
      // E.g.:
      //
      // - `[p]:flex`
      if (!selector.includes('&')) {
        selector = `&:is(${selector})`
      }
    }

    return {
      kind: 'arbitrary',
      selector,
      compounds: true,
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

    let [root, value] = findRoot(variantWithoutModifier, variants)

    // Variant is invalid, therefore the candidate is invalid and we can skip
    // continue parsing it.
    if (root === null) return null

    switch (variants.kind(root)) {
      case 'static': {
        if (value !== null) return null

        return {
          kind: 'static',
          root,
          compounds: variants.compounds(root),
        }
      }

      case 'functional': {
        if (value === null) return null

        if (value[0] === '[' && value[value.length - 1] === ']') {
          return {
            kind: 'functional',
            root,
            modifier: modifier === null ? null : parseModifier(modifier),
            value: {
              kind: 'arbitrary',
              value: decodeArbitraryValue(value.slice(1, -1)),
            },
            compounds: variants.compounds(root),
          }
        }

        return {
          kind: 'functional',
          root,
          modifier: modifier === null ? null : parseModifier(modifier),
          value: { kind: 'named', value },
          compounds: variants.compounds(root),
        }
      }

      case 'compound': {
        if (value === null) return null

        let subVariant = parsedVariants.get(value)
        if (subVariant === null) return null
        if (subVariant.compounds === false) return null

        return {
          kind: 'compound',
          root,
          modifier: modifier === null ? null : { kind: 'named', value: modifier },
          variant: subVariant,
          compounds: variants.compounds(root),
        }
      }
    }
  }

  return null
}

function findRoot(
  input: string,
  lookup: { has: (input: string) => boolean },
): [string | null, string | null] {
  // If the lookup has an exact match, then that's the root.
  if (lookup.has(input)) return [input, null]

  // Otherwise test every permutation of the input by iteratively removing
  // everything after the last dash.
  let idx = input.lastIndexOf('-')
  if (idx === -1) {
    // Variants starting with `@` are special because they don't need a `-`
    // after the `@` (E.g.: `@-lg` should be written as `@lg`).
    if (input[0] === '@' && lookup.has('@')) {
      return ['@', input.slice(1)]
    }

    return [null, null]
  }

  // Determine the root and value by testing permutations of the incoming input
  // against the lookup table.
  //
  // In case of a candidate like `bg-red-500`, this looks like:
  //
  // `bg-red-500` -> No match
  // `bg-red`     -> No match
  // `bg`         -> Match
  do {
    let maybeRoot = input.slice(0, idx)

    if (lookup.has(maybeRoot)) {
      return [maybeRoot, input.slice(idx + 1)]
    }

    idx = input.lastIndexOf('-', idx - 1)
  } while (idx > 0)

  return [null, null]
}
