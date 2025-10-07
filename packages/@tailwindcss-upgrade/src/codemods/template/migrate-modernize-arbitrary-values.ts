import { cloneCandidate, parseCandidate } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { replaceObject } from '../../../../tailwindcss/src/utils/replace-object'
import { walkVariants } from '../../utils/walk-variants'

export function migrateModernizeArbitraryValues(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): string {
  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    let clone = cloneCandidate(candidate)
    let changed = false

    for (let [variant] of walkVariants(clone)) {
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

      // Promote `group-[]:flex` to `in-[.group]:flex`
      //                ^^ Yes, this is empty
      // Promote `group-[]/name:flex` to `in-[.group\/name]:flex`
      if (
        variant.kind === 'compound' &&
        variant.root === 'group' &&
        variant.variant.kind === 'arbitrary' &&
        variant.variant.selector === '&'
      ) {
        // `group-[]`
        if (variant.modifier === null) {
          changed = true
          replaceObject(
            variant,
            designSystem.parseVariant(
              designSystem.theme.prefix
                ? `in-[.${designSystem.theme.prefix}\\:group]`
                : 'in-[.group]',
            ),
          )
        }

        // `group-[]/name`
        else if (variant.modifier.kind === 'named') {
          changed = true
          replaceObject(
            variant,
            designSystem.parseVariant(
              designSystem.theme.prefix
                ? `in-[.${designSystem.theme.prefix}\\:group\\/${variant.modifier.value}]`
                : `in-[.group\\/${variant.modifier.value}]`,
            ),
          )
        }
        continue
      }
    }

    return changed ? designSystem.printCandidate(clone) : rawCandidate
  }

  return rawCandidate
}
