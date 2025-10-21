import { cloneCandidate } from '../../../../tailwindcss/src/candidate'
import {
  PRE_COMPUTED_VARIANTS_KEY,
  prepareDesignSystemStorage,
  VARIANT_SIGNATURE_KEY,
} from '../../../../tailwindcss/src/canonicalize-candidates'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import type { Writable } from '../../../../tailwindcss/src/types'
import { replaceObject } from '../../../../tailwindcss/src/utils/replace-object'
import { walkVariants } from '../../utils/walk-variants'

export function migrateArbitraryVariants(
  baseDesignSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): string {
  let designSystem = prepareDesignSystemStorage(baseDesignSystem)
  let signatures = designSystem.storage[VARIANT_SIGNATURE_KEY]
  let variants = designSystem.storage[PRE_COMPUTED_VARIANTS_KEY]

  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    // We are only interested in the variants
    if (readonlyCandidate.variants.length <= 0) return rawCandidate

    // The below logic makes use of mutation. Since candidates in the
    // DesignSystem are cached, we can't mutate them directly.
    let candidate = cloneCandidate(readonlyCandidate) as Writable<typeof readonlyCandidate>

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
