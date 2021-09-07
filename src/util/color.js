import namedColors from 'color-name'

let HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i
let SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i
let VALUE = `(?:\\d+|\\d*\\.\\d+)%?`
let SEP = `(?:,\\s*|\\s+)`
let ALPHA_SEP = `\\s*[,/]\\s*`
let RGB_HSL = new RegExp(
  `^(rgb|hsl)a?\\(\\s*(${VALUE})${SEP}(${VALUE})${SEP}(${VALUE})(?:${ALPHA_SEP}(${VALUE}))?\\s*\\)$`
)

export function parseColor(value) {
  if (typeof value !== 'string') {
    return null
  }

  value = value.trim()

  if (value in namedColors) {
    return {
      mode: 'rgb',
      color: namedColors[value],
    }
  }

  let hex = value
    .replace(SHORT_HEX, (_, r, g, b, a) => ['#', r, r, g, g, b, b, a ? a + a : ''].join(''))
    .match(HEX)

  if (hex !== null) {
    return {
      mode: 'rgb',
      color: [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)],
      alpha: hex[4] ? parseInt(hex[4], 16) / 255 : undefined,
    }
  }

  let match = value.match(RGB_HSL)

  if (match !== null) {
    return {
      mode: match[1],
      color: [match[2], match[3], match[4]],
      alpha: match[5],
    }
  }

  return null
}

export function formatColor({ mode, color, alpha }) {
  let hasAlpha = alpha !== undefined
  return `${mode}${hasAlpha ? 'a' : ''}(${color.join(', ')}${hasAlpha ? `, ${alpha}` : ''})`
}
