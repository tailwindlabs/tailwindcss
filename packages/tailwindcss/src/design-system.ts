import { toCss } from './ast'
import { parseCandidate, parseVariant } from './candidate'
import { compileAstNodes, compileCandidates } from './compile'
import { getClassList, getVariants, type ClassEntry, type VariantEntry } from './intellisense'
import { getClassOrder } from './sort'
import type { Theme } from './theme'
import { Utilities, createUtilities } from './utilities'
import { DefaultMap } from './utils/default-map'
import { Variants, createVariants } from './variants'

export type DesignSystem = {
  theme: Theme
  utilities: Utilities
  variants: Variants

  candidatesToCss(classes: string[]): (string | null)[]
  getClassOrder(classes: string[]): [string, bigint | null][]
  getClassList(): ClassEntry[]
  getVariants(): VariantEntry[]

  parseCandidate(candidate: string): ReturnType<typeof parseCandidate>
  parseVariant(variant: string): ReturnType<typeof parseVariant>
  compileAstNodes(candidate: string): ReturnType<typeof compileAstNodes>

  getUsedVariants(): ReturnType<typeof parseVariant>[]
}

export function buildDesignSystem(theme: Theme): DesignSystem {
  let utilities = createUtilities(theme)
  let variants = createVariants(theme)

  let parsedVariants = new DefaultMap((variant) => parseVariant(variant, designSystem))
  let parsedCandidates = new DefaultMap((candidate) => parseCandidate(candidate, designSystem))
  let compiledAstNodes = new DefaultMap((candidate) => compileAstNodes(candidate, designSystem))

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
    compileAstNodes(candidate: string) {
      return compiledAstNodes.get(candidate)
    },
    getUsedVariants() {
      return Array.from(parsedVariants.values())
    },
  }

  return designSystem
}
