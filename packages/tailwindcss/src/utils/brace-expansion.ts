import { segment } from './segment'

const NUMERICAL_RANGE = /^(-?\d+)\.\.(-?\d+)(?:\.\.(-?\d+))?$/

export function expand(pattern: string): string[] {
  let index = pattern.indexOf('{')
  if (index === -1) return [pattern]

  let result: string[] = []
  let pre = pattern.slice(0, index)
  let rest = pattern.slice(index)

  // Find the matching closing brace
  let depth = 0
  let endIndex = rest.lastIndexOf('}')
  for (let i = 0; i < rest.length; i++) {
    let char = rest[i]
    if (char === '{') {
      depth++
    } else if (char === '}') {
      depth--
      if (depth === 0) {
        endIndex = i
        break
      }
    }
  }

  if (endIndex === -1) {
    throw new Error(`The pattern \`${pattern}\` is not balanced.`)
  }

  let inside = rest.slice(1, endIndex)
  let post = rest.slice(endIndex + 1)
  let parts: string[]

  if (isSequence(inside)) {
    parts = expandSequence(inside)
  } else {
    parts = segment(inside, ',')
  }

  parts = parts.flatMap((part) => expand(part))

  let expandedTail = expand(post)

  for (let tail of expandedTail) {
    for (let part of parts) {
      result.push(pre + part + tail)
    }
  }
  return result
}

function isSequence(str: string): boolean {
  return NUMERICAL_RANGE.test(str)
}

/**
 * Expands a sequence string like "01..20" (optionally with a step).
 */
function expandSequence(seq: string): string[] {
  let seqMatch = seq.match(NUMERICAL_RANGE)
  if (!seqMatch) {
    return [seq]
  }
  let [, start, end, stepStr] = seqMatch
  let step = stepStr ? parseInt(stepStr, 10) : undefined
  let result: string[] = []

  if (/^-?\d+$/.test(start) && /^-?\d+$/.test(end)) {
    let startNum = parseInt(start, 10)
    let endNum = parseInt(end, 10)

    if (step === undefined) {
      step = startNum <= endNum ? 1 : -1
    }
    if (step === 0) {
      throw new Error('Step cannot be zero in sequence expansion.')
    }

    let increasing = startNum < endNum
    if (increasing && step < 0) step = -step
    if (!increasing && step > 0) step = -step

    for (let i = startNum; increasing ? i <= endNum : i >= endNum; i += step) {
      result.push(i.toString())
    }
  }
  return result
}
