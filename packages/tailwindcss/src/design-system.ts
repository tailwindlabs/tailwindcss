import { toCss } from './ast'
import { compileCandidates } from './compile'
import { getClassList, getVariants, type ClassEntry, type VariantEntry } from './intellisense'
import { getClassOrder } from './sort'
import type { Theme } from './theme'
import { Utilities, createUtilities } from './utilities'
import { Variants, createVariants } from './variants'

export type DesignSystem = {
  theme: Theme
  utilities: Utilities
  variants: Variants

  candidatesToCss(classes: string[]): (string | null)[]
  getClassOrder(classes: string[]): [string, bigint | null][]
  getClassList(): ClassEntry[]
  getVariants(): VariantEntry[]
}

export function buildDesignSystem(theme: Theme): DesignSystem {
  return {
    theme,
    utilities: createUtilities(theme),
    variants: createVariants(theme),

    candidatesToCss(classes: string[]) {
      let result: (string | null)[] = []

      for (let className of classes) {
        let { astNodes } = compileCandidates([className], this, { throwOnInvalidCandidate: false })
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
  }
}
