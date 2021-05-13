import createColor from 'color'
import _ from 'lodash'

function hasAlpha(color) {
  return (
    color.startsWith('rgba(') ||
    color.startsWith('hsla(') ||
    (color.startsWith('#') && color.length === 9) ||
    (color.startsWith('#') && color.length === 5)
  )
}

export function toRgba(color) {
  const [r, g, b, a] = createColor(color).rgb().array()

  return [r, g, b, a === undefined && hasAlpha(color) ? 1 : a]
}

export function toHsla(color) {
  const [h, s, l, a] = createColor(color).hsl().array()

  return [h, `${s}%`, `${l}%`, a === undefined && hasAlpha(color) ? 1 : a]
}

export function withAlphaValue(color, alphaValue, defaultValue) {
  if (_.isFunction(color)) {
    return color({ opacityValue: alphaValue })
  }

  try {
    const isHSL = color.startsWith('hsl')
    const [i, j, k] = isHSL ? toHsla(color) : toRgba(color)
    return `${isHSL ? 'hsla' : 'rgba'}(${i}, ${j}, ${k}, ${alphaValue})`
  } catch {
    return defaultValue
  }
}

export default function withAlphaVariable({ color, property, variable }) {
  if (_.isFunction(color)) {
    return {
      [variable]: '1',
      [property]: color({ opacityVariable: variable, opacityValue: `var(${variable})` }),
    }
  }

  try {
    let customProperty = false

    // A var() with a comma always has a fallback. We will try to parse fallback as a color.
    if (color.startsWith('var(') && color.includes(',')) {
      // Get the var name by removing `var(` and everything after the comma.
      customProperty = color.split(',')[0].substring(4)
      // To get the fallback, we remove everything before the first comma,
      // remove the comma and the trailing bracket and trim whitespace.
      color = color.split(',').slice(1).join(',').slice(1, -1).trim()
    }

    const isHSL = color.startsWith('hsl')

    const [i, j, k, a] = isHSL ? toHsla(color) : toRgba(color)

    if (a !== undefined) {
      return {
        [property]: customProperty ? `var(${customProperty}, ${color})` : color,
      }
    }

    color = `${isHSL ? 'hsla' : 'rgba'}(${i}, ${j}, ${k}, var(${variable}))`

    return {
      [variable]: '1',
      [property]: customProperty ? `var(${customProperty}, ${color})` : color,
    }
  } catch (error) {
    return {
      [property]: color,
    }
  }
}
