import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { printCandidate } from '../candidates'

const DIRECTIONS = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']

export function bgGradient(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (candidate.kind === 'static' && candidate.root.startsWith('bg-gradient-to-')) {
      let direction = candidate.root.slice(15)

      if (!DIRECTIONS.includes(direction)) {
        continue
      }

      return printCandidate(designSystem, {
        ...candidate,
        root: `bg-linear-to-${direction}`,
      })
    }
  }
  return rawCandidate
}
