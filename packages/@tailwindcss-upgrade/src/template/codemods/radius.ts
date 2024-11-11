import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { printCandidate } from '../candidates'

export function radius(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (candidate.kind === 'functional' && candidate.root === 'rounded') {
      return printCandidate(designSystem, {
        ...candidate,
        root: 'radius',
      })
    }
  }
  return rawCandidate
}
