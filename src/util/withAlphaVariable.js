import * as culori from 'culori'
import _ from 'lodash'

function isValidColor(color) {
  return culori.parse(color) !== undefined
}

export function withAlphaValue(color, alphaValue, defaultValue) {
  if (_.isFunction(color)) {
    return color({ opacityValue: alphaValue })
  }

  if (isValidColor(color)) {
    // Parse color
    const parsed = culori.parse(color)

    // Apply alpha value
    parsed.alpha = alphaValue

    // Return formatted string
    if (parsed.mode === 'hsl') {
      return culori.formatHsl(parsed)
    } else {
      return culori.formatRgb(parsed)
    }
  }

  return defaultValue
}

export default function withAlphaVariable({ color, property, variable }) {
  if (_.isFunction(color)) {
    return {
      [variable]: '1',
      [property]: color({ opacityVariable: variable, opacityValue: `var(${variable})` }),
    }
  }

  if (isValidColor(color)) {
    const parsed = culori.parse(color)

    if ('alpha' in parsed) {
      // Has an alpha value, return color as-is
      return {
        [property]: color,
      }
    }

    const formatFn = parsed.mode === 'hsl' ? 'formatHsl' : 'formatRgb'
    const value = culori[formatFn]({
      ...parsed,
      alpha: 0.3,
    }).replace('0.3)', `var(${variable}))`)

    return {
      [variable]: '1',
      [property]: value,
    }
  }

  return {
    [property]: color,
  }
}
