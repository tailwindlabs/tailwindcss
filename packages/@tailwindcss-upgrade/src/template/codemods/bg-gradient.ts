import type { Candidate } from '../../../../tailwindcss/src/candidate'

const DIRECTIONS = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']

export function bgGradient(candidate: Candidate): Candidate | null {
  if (candidate.kind === 'static' && candidate.root.startsWith('bg-gradient-to-')) {
    let direction = candidate.root.slice(15)

    if (!DIRECTIONS.includes(direction)) {
      return null
    }

    candidate.root = `bg-linear-to-${direction}`
    return candidate
  }
  return null
}
