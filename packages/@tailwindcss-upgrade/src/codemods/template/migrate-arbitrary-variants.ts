import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { memcpy } from '../../utils/memcpy'
import type { Writable } from '../../utils/types'
import { walkVariants } from '../../utils/walk-variants'
import { printCandidate, printVariant } from './candidates'
import { computeVariantSignature } from './signatures'

const variantsLookup = new DefaultMap<DesignSystem, DefaultMap<string, string[]>>(
  (designSystem) => {
    let signatures = computeVariantSignature.get(designSystem)
    let lookup = new DefaultMap<string, string[]>(() => [])

    // Actual static variants
    for (let [root, variant] of designSystem.variants.entries()) {
      if (variant.kind === 'static') {
        let signature = signatures.get(root)
        if (signature === null) continue
        lookup.get(signature).push(root)
      }
    }

    return lookup
  },
)

export function migrateArbitraryVariants(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): string {
  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    // We are only interested in the variants
    if (readonlyCandidate.variants.length <= 0) return rawCandidate

    // The below logic makes use of mutation. Since candidates in the
    // DesignSystem are cached, we can't mutate them directly.
    let candidate = structuredClone(readonlyCandidate) as Writable<typeof readonlyCandidate>

    for (let [variant] of walkVariants(candidate)) {
      if (variant.kind === 'compound') continue

      let targetString = printVariant(variant)
      let targetSignature = computeVariantSignature.get(designSystem).get(targetString)
      if (!targetSignature) continue

      let foundVariants = variantsLookup.get(designSystem).get(targetSignature)
      if (foundVariants.length !== 1) continue

      let foundVariant = foundVariants[0]
      let parsedVariant = designSystem.parseVariant(foundVariant)
      if (parsedVariant === null) continue

      memcpy(variant, parsedVariant)
    }

    return printCandidate(designSystem, candidate)
  }

  return rawCandidate
}
