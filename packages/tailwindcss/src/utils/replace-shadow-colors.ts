import { segment } from './segment'

const KEYWORDS = new Set(['inset', 'inherit', 'initial', 'revert', 'unset'])
const LENGTH = /^-?(\d+|\.\d+)(.*?)$/g

export function replaceShadowColors(input: string, replacement: string): string {
  for (let shadow of segment(input, ',')) {
    let parts = segment(shadow, ' ').filter((part) => part.trim() !== '')
    let color = null
    let offsetX = null
    let offsetY = null

    for (let part of parts) {
      if (KEYWORDS.has(part)) {
        continue
      } else if (LENGTH.test(part)) {
        if (offsetX === null) {
          offsetX = part
        } else if (offsetY === null) {
          offsetY = part
        }

        // Reset index, since the regex is stateful.
        LENGTH.lastIndex = 0
      } else if (color === null) {
        color = part
      }
    }

    // Only replace if we found an x-offset, y-offset, and color, otherwise we
    // may be replacing the wrong part of the box-shadow.
    if (offsetX !== null && offsetY !== null && color !== null) {
      input = input.replace(color, replacement)
    }
  }

  return input
}
