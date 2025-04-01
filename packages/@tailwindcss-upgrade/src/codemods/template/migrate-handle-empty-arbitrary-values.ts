import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'

export function migrateEmptyArbitraryValues(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  // We can parse the candidate, nothing to do
  if (designSystem.parseCandidate(rawCandidate).length > 0) {
    return rawCandidate
  }

  // No need to handle empty arbitrary values
  if (!rawCandidate.includes('[]')) {
    return rawCandidate
  }

  // Add the `&` placeholder to the empty arbitrary values. Other codemods might
  // migrate these away, but if not, then it's at least valid to parse.
  //
  // E.g.: `group-[]:flex` => `group-[&]:flex`
  // E.g.: `group-[]/name:flex` => `group-[&]/name:flex`
  return rawCandidate
    .replaceAll('-[]:', '-[&]:') // End of variant
    .replaceAll('-[]/', '-[&]/') // With modifier
}
