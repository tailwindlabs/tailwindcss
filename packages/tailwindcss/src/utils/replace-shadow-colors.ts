import { isLength } from './infer-data-type'
import { segment } from './segment'

const KEYWORDS = new Set(['inset', 'inherit', 'initial', 'revert', 'unset'])
const IS_ZERO = /^-?0*\.?0+(?:[eE][+-]?\d+)?$/

export function replaceShadowColors(input: string, replacement: (color: string) => string) {
  let shadows = segment(input, ',').map((shadow) => {
    shadow = shadow.trim()
    let parts = segment(shadow, ' ').filter((part) => part.trim() !== '')
    let color = null
    let offsetX = null
    let offsetY = null

    for (let part of parts) {
      if (KEYWORDS.has(part)) {
        continue
      } else if (isLength(part) || IS_ZERO.test(part)) {
        if (offsetX === null) {
          offsetX = part
        } else if (offsetY === null) {
          offsetY = part
        }
      } else if (color === null) {
        color = part
      }
    }

    // If the x and y offsets were not detected, the shadow is either invalid or
    // using a variable to represent more than one field in the shadow value, so
    // we can't know what to replace.
    if (offsetX === null || offsetY === null) return shadow

    let replacementColor = replacement(color ?? 'currentcolor')

    if (color !== null) {
      // If a color was found, replace the color.
      return shadow.replace(color, replacementColor)
    }
    // If no color was found, assume the shadow is relying on the browser
    // default shadow color and append the replacement color.
    return `${shadow} ${replacementColor}`
  })

  return shadows.join(', ')
}
