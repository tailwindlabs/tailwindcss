import * as culori from 'culori'

function isValidColor(color) {
  return culori.parse(color) !== undefined
}

export function withAlphaValue(color, alphaValue, defaultValue) {
  if (typeof color === 'function') {
    return color({ opacityValue: alphaValue })
  }

  if (isValidColor(color)) {
    // Parse color
    const parsed = culori.parse(color)

    // Apply alpha value
    parsed.alpha = alphaValue

    // Format string
    let value
    if (parsed.mode === 'hsl') {
      value = culori.formatHsl(parsed)
    } else {
      value = culori.formatRgb(parsed)
    }

    // Correctly apply CSS variable alpha value
    if (typeof alphaValue === 'string' && alphaValue.startsWith('var(') && value.endsWith('NaN)')) {
      value = value.replace('NaN)', `${alphaValue})`)
    }

    // Color could not be formatted correctly
    if (!value.includes('NaN')) {
      return value
    }
  }

  return defaultValue
}

export default function withAlphaVariable({ color, property, variable }) {
  if (typeof color === 'function') {
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
      alpha: NaN, // intentionally set to `NaN` for replacing
    }).replace('NaN)', `var(${variable}))`)

    return {
      [variable]: '1',
      [property]: value,
    }
  }

  return {
    [property]: color,
  }
}
