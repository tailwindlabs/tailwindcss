import { decl, rule, type AstNode } from '../ast'
import { replaceAlpha, withAlpha } from '../utilities'
import { segment } from './segment'

const KEYWORDS = new Set(['inset', 'inherit', 'initial', 'revert', 'unset'])
const LENGTH = /^-?(\d+|\.\d+)(.*?)$/g

export function replaceShadowColors(
  property: string,
  input: string,
  intensity: string | null | undefined,
  replacer: (color: string) => string,
  prefix: string = '',
): AstNode[] {
  let fallbackShadows: string[] = []
  let shadows: string[] = []

  let requiresFallback = false

  segment(input, ',').map((shadow) => {
    shadow = shadow.trim()
    let parts = segment(shadow, ' ').filter((part) => part.trim() !== '')
    let color: string | null = null
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

    // If the x and y offsets were not detected, the shadow is either invalid or using a variable to
    // represent more than one field in the shadow value, so we can't know what to replace.
    if (offsetX === null || offsetY === null) {
      shadows.push(shadow)
      fallbackShadows.push(shadow)
      return
    }

    function replace(replacement: string) {
      let replacementColor = replacer(replacement)

      if (color !== null) {
        // If a color was found, replace the color.
        return shadow.replace(color, replacementColor)
      }
      // If no color was found, assume the shadow is relying on the browser default shadow color and
      // append the replacement color.
      return `${shadow} ${replacementColor}`
    }

    if (intensity == null) {
      let replacement = replace(color ?? 'currentcolor')
      shadows.push(replacement)
      fallbackShadows.push(replacement)
      return
    }

    // When the input is currentcolor, we use our existing `color-mix(…)` approach to increase
    // browser support. Note that the fallback of this is handled more generically in
    // post-processing.
    if (color === null || color.startsWith('current')) {
      let replacement = replace(withAlpha(color ?? 'currentcolor', intensity))
      shadows.push(replacement)
      fallbackShadows.push(replacement)
      return
    }

    // If any dynamic values are needed for the relative color syntax, we need to insert a
    // replacement as lightningcss won't be able to resolve them statically.
    if (color.startsWith('var(') || intensity.startsWith('var(')) {
      requiresFallback = true
    }

    shadows.push(replace(replaceAlpha(color ?? 'currentcolor', intensity)))
    fallbackShadows.push(replace(color ?? 'currentcolor'))
  })

  if (requiresFallback) {
    return [
      decl(property, `${prefix}${fallbackShadows.join(', ')}`),
      rule('@supports (color: lab(from red l a b))', [
        decl(property, `${prefix}${shadows.join(', ')}`),
      ]),
    ]
  } else {
    return [decl(property, `${prefix}${shadows.join(', ')}`)]
  }
}
