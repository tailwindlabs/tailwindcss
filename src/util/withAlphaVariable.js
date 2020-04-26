import createColor from 'color'

function hasAlpha(color) {
  return (
    color.startsWith('rgba(') ||
    color.startsWith('hsla(') ||
    (color.startsWith('#') && color.length === 9) ||
    (color.startsWith('#') && color.length === 5)
  )
}

function toRgba(color) {
  const [r, g, b, a] = createColor(color)
    .rgb()
    .array()

  return [r, g, b, a === undefined && hasAlpha(color) ? 1 : a]
}

export default function withAlphaVariable({ color, property, variable }) {
  try {
    const [r, g, b, a] = toRgba(color)

    if (a !== undefined) {
      return {
        [property]: color,
      }
    }

    return {
      [variable]: '1',
      [property]: [color, `rgba(${r}, ${g}, ${b}, var(${variable}))`],
    }
  } catch (error) {
    return {
      [property]: color,
    }
  }
}
