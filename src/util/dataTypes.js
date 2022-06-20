import { parseColor } from './color'
import { parseBoxShadowValue } from './parseBoxShadowValue'

let cssFunctions = ['min', 'max', 'clamp', 'calc']

// Ref: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Types

let COMMA = /,(?![^(]*\))/g // Comma separator that is not located between brackets. E.g.: `cubiz-bezier(a, b, c)` these don't count.
let UNDERSCORE = /_(?![^(]*\))/g // Underscore separator that is not located between brackets. E.g.: `rgba(255,_255,_255)_black` these don't count.

// This is not a data type, but rather a function that can normalize the
// correct values.
export function normalize(value, isRoot = true) {
  // Keep raw strings if it starts with `url(`
  if (value.includes('url(')) {
    return value
      .split(/(url\(.*?\))/g)
      .filter(Boolean)
      .map((part) => {
        if (/^url\(.*?\)$/.test(part)) {
          return part
        }

        return normalize(part, false)
      })
      .join('')
  }

  // Convert `_` to ` `, except for escaped underscores `\_`
  value = value
    .replace(
      /([^\\])_+/g,
      (fullMatch, characterBefore) => characterBefore + ' '.repeat(fullMatch.length - 1)
    )
    .replace(/^_/g, ' ')
    .replace(/\\_/g, '_')

  // Remove leftover whitespace
  if (isRoot) {
    value = value.trim()
  }

  // Add spaces around operators inside math functions like calc() that do not follow an operator
  // or '('.
  value = value.replace(/(calc|min|max|clamp)\(.+\)/g, (match) => {
    return match.replace(
      /(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g,
      '$1 $2 '
    )
  })

  return value
}

export function url(value) {
  return value.startsWith('url(')
}

export function number(value) {
  return !isNaN(Number(value)) || cssFunctions.some((fn) => new RegExp(`^${fn}\\(.+?`).test(value))
}

export function percentage(value) {
  return value.split(UNDERSCORE).every((part) => {
    return /%$/g.test(part) || cssFunctions.some((fn) => new RegExp(`^${fn}\\(.+?%`).test(part))
  })
}

let lengthUnits = [
  'cm',
  'mm',
  'Q',
  'in',
  'pc',
  'pt',
  'px',
  'em',
  'ex',
  'ch',
  'rem',
  'lh',
  'vw',
  'vh',
  'vmin',
  'vmax',
]
let lengthUnitsPattern = `(?:${lengthUnits.join('|')})`
export function length(value) {
  return value.split(UNDERSCORE).every((part) => {
    return (
      part === '0' ||
      new RegExp(`${lengthUnitsPattern}$`).test(part) ||
      cssFunctions.some((fn) => new RegExp(`^${fn}\\(.+?${lengthUnitsPattern}`).test(part))
    )
  })
}

let lineWidths = new Set(['thin', 'medium', 'thick'])
export function lineWidth(value) {
  return lineWidths.has(value)
}

export function shadow(value) {
  let parsedShadows = parseBoxShadowValue(normalize(value))

  for (let parsedShadow of parsedShadows) {
    if (!parsedShadow.valid) {
      return false
    }
  }

  return true
}

export function color(value) {
  let colors = 0

  let result = value.split(UNDERSCORE).every((part) => {
    part = normalize(part)

    if (part.startsWith('var(')) return true
    if (parseColor(part, { loose: true }) !== null) return colors++, true

    return false
  })

  if (!result) return false
  return colors > 0
}

export function image(value) {
  let images = 0
  let result = value.split(COMMA).every((part) => {
    part = normalize(part)

    if (part.startsWith('var(')) return true
    if (
      url(part) ||
      gradient(part) ||
      ['element(', 'image(', 'cross-fade(', 'image-set('].some((fn) => part.startsWith(fn))
    ) {
      images++
      return true
    }

    return false
  })

  if (!result) return false
  return images > 0
}

let gradientTypes = new Set([
  'linear-gradient',
  'radial-gradient',
  'repeating-linear-gradient',
  'repeating-radial-gradient',
  'conic-gradient',
])
export function gradient(value) {
  value = normalize(value)

  for (let type of gradientTypes) {
    if (value.startsWith(`${type}(`)) {
      return true
    }
  }
  return false
}

let validPositions = new Set(['center', 'top', 'right', 'bottom', 'left'])
export function position(value) {
  let positions = 0
  let result = value.split(UNDERSCORE).every((part) => {
    part = normalize(part)

    if (part.startsWith('var(')) return true
    if (validPositions.has(part) || length(part) || percentage(part)) {
      positions++
      return true
    }

    return false
  })

  if (!result) return false
  return positions > 0
}

export function familyName(value) {
  let fonts = 0
  let result = value.split(COMMA).every((part) => {
    part = normalize(part)

    if (part.startsWith('var(')) return true

    // If it contains spaces, then it should be quoted
    if (part.includes(' ')) {
      if (!/(['"])([^"']+)\1/g.test(part)) {
        return false
      }
    }

    // If it starts with a number, it's invalid
    if (/^\d/g.test(part)) {
      return false
    }

    fonts++

    return true
  })

  if (!result) return false
  return fonts > 0
}

let genericNames = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'math',
  'emoji',
  'fangsong',
])
export function genericName(value) {
  return genericNames.has(value)
}

let absoluteSizes = new Set([
  'xx-small',
  'x-small',
  'small',
  'medium',
  'large',
  'x-large',
  'x-large',
  'xxx-large',
])
export function absoluteSize(value) {
  return absoluteSizes.has(value)
}

let relativeSizes = new Set(['larger', 'smaller'])
export function relativeSize(value) {
  return relativeSizes.has(value)
}
