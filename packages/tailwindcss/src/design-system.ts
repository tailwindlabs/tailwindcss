import { Polyfills } from '.'
import { optimizeAst, toCss } from './ast'
import { parseCandidate, parseVariant, type Candidate, type Variant } from './candidate'
import { compileAstNodes, compileCandidates } from './compile'
import { substituteFunctions } from './css-functions'
import { getClassList, getVariants, type ClassEntry, type VariantEntry } from './intellisense'
import { getClassOrder } from './sort'
import { Theme, ThemeOptions, type ThemeKey } from './theme'
import { Utilities, createUtilities, withAlpha } from './utilities'
import { DefaultMap } from './utils/default-map'
import { extractUsedVariables } from './utils/variables'
import { Variants, createVariants } from './variants'

export type DesignSystem = {
  theme: Theme
  utilities: Utilities
  variants: Variants

  invalidCandidates: Set<string>

  // Whether to mark utility declarations as !important
  important: boolean

  getClassOrder(classes: string[]): [string, bigint | null][]
  getClassList(): ClassEntry[]
  getVariants(): VariantEntry[]

  parseCandidate(candidate: string): Readonly<Candidate>[]
  parseVariant(variant: string): Readonly<Variant> | null
  compileAstNodes(candidate: Candidate): ReturnType<typeof compileAstNodes>

  getVariantOrder(): Map<Variant, number>
  resolveThemeValue(path: string, forceInline?: boolean): string | undefined

  trackUsedVariables(raw: string): void

  // Used by IntelliSense
  candidatesToCss(classes: string[]): (string | null)[]
}

export function buildDesignSystem(theme: Theme): DesignSystem {
  let utilities = createUtilities(theme)
  let variants = createVariants(theme)

  let parsedVariants = new DefaultMap((variant) => parseVariant(variant, designSystem))
  let parsedCandidates = new DefaultMap((candidate) =>
    Array.from(parseCandidate(candidate, designSystem)),
  )

  let compiledAstNodes = new DefaultMap<Candidate>((candidate) => {
    let ast = compileAstNodes(candidate, designSystem)

    // Arbitrary values (`text-[theme(--color-red-500)]`) and arbitrary
    // properties (`[--my-var:theme(--color-red-500)]`) can contain function
    // calls so we need evaluate any functions we find there that weren't in
    // the source CSS.
    try {
      substituteFunctions(
        ast.map(({ node }) => node),
        designSystem,
      )
    } catch (err) {
      // If substitution fails then the candidate likely contains a call to
      // `theme()` that is invalid which may be because of incorrect usage,
      // invalid arguments, or a theme key that does not exist.
      return []
    }

    return ast
  })

  let trackUsedVariables = new DefaultMap((raw) => {
    for (let variable of extractUsedVariables(raw)) {
      theme.markUsedVariable(variable)
    }
  })

  let designSystem: DesignSystem = {
    theme,
    utilities,
    variants,

    invalidCandidates: new Set(),
    important: false,

    candidatesToCss(classes: string[]) {
      let result: (string | null)[] = []

      for (let className of classes) {
        let wasInvalid = false

        let { astNodes } = compileCandidates([className], this, {
          onInvalidCandidate() {
            wasInvalid = true
          },
        })

        // Disable all polyfills to not unnecessarily pollute IntelliSense output
        astNodes = optimizeAst(astNodes, designSystem, Polyfills.None)

        if (astNodes.length === 0 || wasInvalid) {
          result.push(null)
        } else {
          result.push(toCss(astNodes))
        }
      }

      return result
    },

    getClassOrder(classes) {
      return getClassOrder(this, classes)
    },
    getClassList() {
      return getClassList(this)
    },
    getVariants() {
      return getVariants(this)
    },

    parseCandidate(candidate: string) {
      return parsedCandidates.get(candidate)
    },
    parseVariant(variant: string) {
      return parsedVariants.get(variant)
    },
    compileAstNodes(candidate: Candidate) {
      return compiledAstNodes.get(candidate)
    },
    getVariantOrder() {
      let variants = Array.from(parsedVariants.values())
      variants.sort((a, z) => this.variants.compare(a, z))

      let order = new Map<Variant, number>()
      let prevVariant: Variant | undefined = undefined
      let index: number = 0

      for (let variant of variants) {
        if (variant === null) {
          continue
        }
        // This variant is not the same order as the previous one
        // so it goes into a new group
        if (prevVariant !== undefined && this.variants.compare(prevVariant, variant) !== 0) {
          index++
        }

        order.set(variant, index)
        prevVariant = variant
      }

      return order
    },

    resolveThemeValue(path: `${ThemeKey}` | `${ThemeKey}${string}`, forceInline: boolean = true) {
      // Extract an eventual modifier from the path. e.g.:
      // - "--color-red-500 / 50%" -> "50%"
      let lastSlash = path.lastIndexOf('/')
      let modifier: string | null = null
      if (lastSlash !== -1) {
        modifier = path.slice(lastSlash + 1).trim()
        path = path.slice(0, lastSlash).trim() as ThemeKey
      }

      let themeValue =
        theme.resolve(null, [path], forceInline ? ThemeOptions.INLINE : ThemeOptions.NONE) ??
        undefined

      // Apply the opacity modifier if present
      if (modifier && themeValue) {
        return withAlpha(themeValue, modifier)
      }

      return themeValue
    },

    trackUsedVariables(raw: string) {
      trackUsedVariables.get(raw)
    },
  }

  return designSystem
}
