import namedColors from 'color-name'

let HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i
let SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i
let VALUE = /(?:\d+|\d*\.\d+)%?/
let SEP = /(?:\s*,\s*|\s+)/
let ALPHA_SEP = /\s*[,/]\s*/
let CUSTOM_PROPERTY = /var\(--(?:[^ )]*?)\)/

let RGB = new RegExp(
  `^rgba?\\(\\s*(${VALUE.source}|${CUSTOM_PROPERTY.source})${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source})${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source})(?:${ALPHA_SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?\\s*\\)$`
)
let HSL = new RegExp(
  `^hsla?\\(\\s*((?:${VALUE.source})(?:deg|rad|grad|turn)?|${CUSTOM_PROPERTY.source})${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source})${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source})(?:${ALPHA_SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?\\s*\\)$`
)

export function parseColor(value) {
  if (typeof value !== 'string') {
    return null
  }

  value = value.trim()
  if (value === 'transparent') {
    return { mode: 'rgb', color: ['0', '0', '0'], alpha: '0' }
  }

  if (value in namedColors) {
    return { mode: 'rgb', color: namedColors[value].map((v) => v.toString()) }
  }

  let hex = value
    .replace(SHORT_HEX, (_, r, g, b, a) => ['#', r, r, g, g, b, b, a ? a + a : ''].join(''))
    .match(HEX)

  if (hex !== null) {
    return {
      mode: 'rgb',
      color: [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)].map((v) =>
        v.toString()
      ),
      alpha: hex[4] ? (parseInt(hex[4], 16) / 255).toString() : undefined,
    }
  }

  let rgbMatch = value.match(RGB)

  if (rgbMatch !== null) {
    return {
      mode: 'rgb',
      color: [rgbMatch[1], rgbMatch[2], rgbMatch[3]].map((v) => v.toString()),
      alpha: rgbMatch[4]?.toString?.(),
    }
  }

  let hslMatch = value.match(HSL)

  if (hslMatch !== null) {
    return {
      mode: 'hsl',
      color: [hslMatch[1], hslMatch[2], hslMatch[3]].map((v) => v.toString()),
      alpha: hslMatch[4]?.toString?.(),
    }
  }

  return null
}

export function formatColor({ mode, color, alpha }) {
  let hasAlpha = alpha !== undefined
  return `${mode}(${color.join(' ')}${hasAlpha ? ` / ${alpha}` : ''})`
}
