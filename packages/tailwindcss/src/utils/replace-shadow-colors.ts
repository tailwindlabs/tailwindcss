import { segment } from './segment'

const KEYWORDS = new Set(['inset', 'inherit', 'initial', 'revert', 'unset'])
const LENGTH = /^-?(\d+|\.\d+)(.*?)$/g

/**
 * Extract the alpha channel from a color value.
 * Returns the alpha as a percentage string (e.g., "12%") or null if no alpha is found.
 */
function extractAlpha(color: string): string | null {
  // Modern rgba/hsla syntax with slash: rgba(0 0 0 / 0.12) or rgba(0 0 0 / 12%)
  const slashAlphaMatch = color.match(/\/\s*([\d.]+)%?\s*\)/)
  if (slashAlphaMatch) {
    let alpha = slashAlphaMatch[1]
    // If it's already a percentage, return it
    if (slashAlphaMatch[0].includes('%')) {
      return `${alpha}%`
    }
    // Convert decimal to percentage
    const alphaNum = parseFloat(alpha)
    if (!isNaN(alphaNum)) {
      // Round to avoid floating point precision issues
      return `${Math.round(alphaNum * 100)}%`
    }
    return null
  }

  // Legacy rgba/hsla syntax with comma: rgba(0, 0, 0, 0.12)
  const commaAlphaMatch = color.match(/,\s*([\d.]+)\s*\)/)
  if (commaAlphaMatch) {
    const alpha = commaAlphaMatch[1]
    const alphaNum = parseFloat(alpha)
    if (!isNaN(alphaNum)) {
      // Round to avoid floating point precision issues
      return `${Math.round(alphaNum * 100)}%`
    }
    return null
  }

  // No alpha found
  return null
}

/**
 * Extract the base color without the alpha channel.
 * For rgba/hsla, returns rgb/hsl with the same values but without alpha.
 * For other colors, returns as-is.
 */
function stripAlpha(color: string): string {
  // Modern rgba/hsla syntax with slash: rgba(0 0 0 / 0.12) or hsla(0 0% 0% / 0.3)
  const slashMatch = color.match(/^(rgba?|hsla?)\(([\d\s.%]+)\s*\/\s*[\d.]+%?\s*\)$/i)
  if (slashMatch) {
    const type = slashMatch[1].toLowerCase().replace('a', '')
    const values = slashMatch[2].trim()
    return `${type}(${values})`
  }

  // Legacy rgba/hsla syntax with comma: rgba(0, 0, 0, 0.12) or hsla(0, 0%, 0%, 0.3)
  const commaMatch = color.match(/^(rgba?|hsla?)\(([\d\s.,%]+),\s*[\d.]+\s*\)$/i)
  if (commaMatch) {
    const type = commaMatch[1].toLowerCase().replace('a', '')
    const values = commaMatch[2].trim()
    return `${type}(${values})`
  }

  // No alpha to strip
  return color
}

/**
 * Check if a string already contains alpha handling (oklab, color-mix, etc.)
 */
function hasAlphaHandling(value: string): boolean {
  return value.includes('oklab(') || value.includes('color-mix(') || value.includes('oklch(')
}

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

    // If the x and y offsets were not detected, the shadow is either invalid or
    // using a variable to represent more than one field in the shadow value, so
    // we can't know what to replace.
    if (offsetX === null || offsetY === null) return shadow

    // Extract alpha from the original color if present
    let alpha: string | null = null
    let baseColor: string = color ?? 'currentcolor'

    if (color) {
      alpha = extractAlpha(color)
      if (alpha) {
        baseColor = stripAlpha(color)
      }
    }

    let replacementColor = replacement(baseColor)

    // Only apply color-mix wrapping if:
    // 1. The original color had an alpha channel
    // 2. The replacement doesn't already have alpha handling (oklab, color-mix, etc.)
    if (alpha && !hasAlphaHandling(replacementColor)) {
      replacementColor = `color-mix(in srgb, transparent, ${replacementColor} ${alpha})`
    }

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
