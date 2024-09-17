import { toCss } from './ast'
import { parseCandidate, parseVariant, type Candidate } from './candidate'
import { compileAstNodes, compileCandidates } from './compile'
import { getClassList, getVariants, type ClassEntry, type VariantEntry } from './intellisense'
import { getClassOrder } from './sort'
import type { Theme, ThemeKey } from './theme'
import { Utilities, createUtilities, withAlpha } from './utilities'
import { DefaultMap } from './utils/default-map'
import { Variants, createVariants } from './variants'

export type DesignSystem = {
  theme: Theme
  utilities: Utilities
  variants: Variants

  getClassOrder(classes: string[]): [string, bigint | null][]
  getClassList(): ClassEntry[]
  getVariants(): VariantEntry[]

  parseCandidate(candidate: string): Candidate[]
  parseVariant(variant: string): ReturnType<typeof parseVariant>
  compileAstNodes(candidate: Candidate): ReturnType<typeof compileAstNodes>

  getUsedVariantGroups(): Set<ReturnType<typeof parseVariant>>[]
  resolveThemeValue(path: string): string | undefined

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
  let compiledAstNodes = new DefaultMap<Candidate>((candidate) =>
    compileAstNodes(candidate, designSystem),
  )

  let designSystem: DesignSystem = {
    theme,
    utilities,
    variants,

    candidatesToCss(classes: string[]) {
      let result: (string | null)[] = []

      for (let className of classes) {
        let { astNodes } = compileCandidates([className], this)
        if (astNodes.length === 0) {
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
    getUsedVariantGroups() {
      let variants = Array.from(parsedVariants.values())
      return sortAndGroup(variants, (a, z) => this.variants.compare(a, z))
    },

    resolveThemeValue(path: `${ThemeKey}` | `${ThemeKey}${string}`) {
      // Extract an eventual modifier from the path. e.g.:
      // - "--color-red-500 / 50%" -> "50%"
      let lastSlash = path.lastIndexOf('/')
      let modifier: string | null = null
      if (lastSlash !== -1) {
        modifier = path.slice(lastSlash + 1).trim()
        path = path.slice(0, lastSlash).trim() as ThemeKey
      }

      let themeValue = theme.get([path]) ?? undefined

      // Apply the opacity modifier if present
      if (modifier && themeValue) {
        return withAlpha(themeValue, modifier)
      }

      return themeValue
    },
  }

  return designSystem
}

/**
 * Sort an array of entries into an array-of-sets. Similar entries (where the
 * sort function returns 0) are grouped together.
 *
 * Example: [a, c, b, A]
 *
 * Becomes: [Set[a, A], Set[b], Set[c]]
 */
function sortAndGroup<T>(entries: T[], comparator: (a: T, z: T) => number): Set<T>[] {
  let groups: Set<T>[] = []
  let sorted = entries.sort(comparator)
  let prevEntry: T | undefined = undefined

  for (let entry of sorted) {
    let prevSet = groups[groups.length - 1]
    if (prevSet && prevEntry !== undefined && comparator(prevEntry, entry) === 0) {
      prevSet.add(entry)
    } else {
      prevEntry = entry
      groups.push(new Set([entry]))
    }
  }

  return groups
}
