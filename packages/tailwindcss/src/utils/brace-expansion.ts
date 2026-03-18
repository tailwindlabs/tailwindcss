import { expand as braceExpand } from 'brace-expansion'

const ZERO_STEP = /\{-?\d+\.\.-?\d+\.\.0+\}/

export function expand(pattern: string): string[] {
  if (ZERO_STEP.test(pattern)) {
    throw new Error('Step cannot be zero in sequence expansion.')
  }
  return braceExpand(pattern)
}
