import { parseColor, formatColor } from './color'

export function withAlphaValue(color, alphaValue, defaultValue) {
  if (typeof color === 'function') {
    return color({ opacityValue: alphaValue })
  }

  let parsed = parseColor(color)

  if (parsed === null) {
    return defaultValue
  }

  return formatColor({ ...parsed, alpha: alphaValue })
}

export default function withAlphaVariable({ color, property, variable }) {
  if (typeof color === 'function') {
    return {
      [variable]: '1',
      [property]: color({ opacityVariable: variable, opacityValue: `var(${variable})` }),
    }
  }

  const parsed = parseColor(color)

  if (parsed === null) {
    return {
      [property]: color,
    }
  }

  if (parsed.alpha !== undefined) {
    // Has an alpha value, return color as-is
    return {
      [property]: color,
    }
  }

  return {
    [variable]: '1',
    [property]: formatColor({ ...parsed, alpha: `var(${variable})` }),
  }
}
