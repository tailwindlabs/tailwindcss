import { cloneCandidate } from '../../../../tailwindcss/src/candidate'
import { createSignatureOptions } from '../../../../tailwindcss/src/canonicalize-candidates'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import {
  computeVariantSignature,
  preComputedVariants,
} from '../../../../tailwindcss/src/signatures'
import type { Writable } from '../../../../tailwindcss/src/types'
import { replaceObject } from '../../../../tailwindcss/src/utils/replace-object'
import { walkVariants } from '../../utils/walk-variants'

export function migrateArbitraryVariants(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): string {
  let signatureOptions = createSignatureOptions(designSystem)
  let signatures = computeVariantSignature.get(signatureOptions)
  let variants = preComputedVariants.get(signatureOptions)

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
