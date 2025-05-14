import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import * as version from '../../utils/version'

// Converts named values to use kebab-case. This is necessary because the
// upgrade tool also renames the theme values to kebab-case, so `text-superRed`
// will have its theme value renamed to `--color-super-red` and thus the utility
// will be renamed to `text-super-red`.
export function migrateCamelcaseInNamedValue(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): string {
  if (!version.isMajor(3)) return rawCandidate

  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (candidate.kind !== 'functional') continue
    let clone = structuredClone(candidate)
    let didChange = false

    if (
      candidate.value &&
      clone.value &&
      candidate.value.kind === 'named' &&
      clone.value.kind === 'named' &&
      candidate.value.value.match(/[A-Z]/)
    ) {
      clone.value.value = camelToKebab(candidate.value.value)
      didChange = true
    }

    if (
      candidate.modifier &&
      clone.modifier &&
      candidate.modifier.kind === 'named' &&
      clone.modifier.kind === 'named' &&
      candidate.modifier.value.match(/[A-Z]/)
    ) {
      clone.modifier.value = camelToKebab(candidate.modifier.value)
      didChange = true
    }

    if (didChange) {
      return designSystem.printCandidate(clone)
    }
  }

  return rawCandidate
}

function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}
