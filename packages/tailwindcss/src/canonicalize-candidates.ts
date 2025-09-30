import type { DesignSystem } from './design-system'
import { DefaultMap } from './utils/default-map'

export function canonicalizeCandidates(ds: DesignSystem, candidates: string[]): string[] {
  return candidates.map((candidate) => {
    return canonicalizeCandidateCache.get(ds).get(candidate)
  })
}

const canonicalizeCandidateCache = new DefaultMap((ds: DesignSystem) => {
  return new DefaultMap((candidate: string) => {
    let result = candidate
    for (let fn of CANONICALIZATIONS) {
      let newResult = fn(ds, result)
      if (newResult !== result) {
        result = newResult
      }
    }
    return result
  })
})

const CANONICALIZATIONS = [bgGradientToLinear, print]

function print(designSystem: DesignSystem, rawCandidate: string): string {
  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    return designSystem.printCandidate(candidate)
  }
  return rawCandidate
}

const DIRECTIONS = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
function bgGradientToLinear(designSystem: DesignSystem, rawCandidate: string): string {
  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (candidate.kind === 'static' && candidate.root.startsWith('bg-gradient-to-')) {
      let direction = candidate.root.slice(15)

      if (!DIRECTIONS.includes(direction)) {
        continue
      }

      return designSystem.printCandidate({
        ...candidate,
        root: `bg-linear-to-${direction}`,
      })
    }
  }
  return rawCandidate
}
