import { Scanner } from '@tailwindcss/oxide'
import stringByteSlice from 'string-byte-slice'
import type { Candidate, Variant } from '../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'

export async function extractCandidates(
  designSystem: DesignSystem,
  content: string,
): Promise<{ candidate: Candidate; start: number; end: number }[]> {
  let scanner = new Scanner({})
  let result = scanner.getCandidatesWithPositions({ content, extension: 'html' })

  let candidates: { candidate: Candidate; start: number; end: number }[] = []
  for (let { candidate: rawCandidate, position: start } of result) {
    for (let candidate of designSystem.parseCandidate(rawCandidate)) {
      candidates.push({ candidate, start, end: start + rawCandidate.length })
    }
  }
  return candidates
}

export function printCandidate(candidate: Candidate | null) {
  if (candidate === null) return 'null'
  let parts: string[] = []

  for (let variant of candidate.variants) {
    parts.unshift(printVariant(variant))
  }

  let base: string = ''

  // Handle negative
  if (candidate.kind === 'static' || candidate.kind === 'functional') {
    if (candidate.negative) {
      base += '-'
    }
  }

  // Handle static
  if (candidate.kind === 'static') {
    base += candidate.root
  }

  // Handle functional
  if (candidate.kind === 'functional') {
    base += candidate.root

    if (candidate.value) {
      if (candidate.value.kind === 'arbitrary') {
        if (candidate.value === null) {
          base += ''
        } else if (candidate.value.dataType) {
          base += `-[${candidate.value.dataType}:${escapeArbitrary(candidate.value.value)}]`
        } else {
          base += `-[${escapeArbitrary(candidate.value.value)}]`
        }
      } else if (candidate.value.kind === 'named') {
        base += `-${candidate.value.value}`
      }
    }
  }

  // Handle arbitrary
  if (candidate.kind === 'arbitrary') {
    base += `[${candidate.property}:${escapeArbitrary(candidate.value)}]`
  }

  // Handle modifier
  if (candidate.kind === 'arbitrary' || candidate.kind === 'functional') {
    if (candidate.modifier) {
      if (candidate.modifier.kind === 'arbitrary') {
        base += `/[${escapeArbitrary(candidate.modifier.value)}]`
      } else if (candidate.modifier.kind === 'named') {
        base += `/${candidate.modifier.value}`
      }
    }
  }

  // Handle important
  if (candidate.important) {
    base += '!'
  }

  parts.push(base)

  return parts.join(':')
}

function printVariant(variant: Variant) {
  // Handle static variants
  if (variant.kind === 'static') {
    return variant.root
  }

  // Handle arbitrary variants
  if (variant.kind === 'arbitrary') {
    return `[${escapeArbitrary(variant.selector)}]`
  }

  let base: string = ''

  // Handle functional variants
  if (variant.kind === 'functional') {
    base += variant.root
    if (variant.value) {
      if (variant.value.kind === 'arbitrary') {
        base += `-[${escapeArbitrary(variant.value.value)}]`
      } else if (variant.value.kind === 'named') {
        base += `-${variant.value.value}`
      }
    }
  }

  // Handle compound variants
  if (variant.kind === 'compound') {
    base += variant.root
    base += '-'
    base += printVariant(variant.variant)
  }

  // Handle modifiers
  if (variant.kind === 'functional' || variant.kind === 'compound') {
    if (variant.modifier) {
      if (variant.modifier.kind === 'arbitrary') {
        base += `/[${escapeArbitrary(variant.modifier.value)}]`
      } else if (variant.modifier.kind === 'named') {
        base += `/${variant.modifier.value}`
      }
    }
  }

  return base
}

function escapeArbitrary(input: string) {
  return input
    .replaceAll('_', String.raw`\_`) // Escape underscores to keep them as-is
    .replaceAll(' ', '_') // Replace spaces with underscores
}

export function replaceCandidateInContent(
  content: string,
  replacement: string,
  startByte: number,
  endByte: number,
) {
  return stringByteSlice(content, 0, startByte) + replacement + stringByteSlice(content, endByte)
}
