import postcss from 'postcss'

export default function transformThemeValue(themeSection) {
  if (['fontSize', 'outline'].includes(themeSection)) {
    return (value) => (Array.isArray(value) ? value[0] : value)
  }

  if (
    [
      'fontFamily',
      'boxShadow',
      'transitionProperty',
      'transitionDuration',
      'transitionDelay',
      'transitionTimingFunction',
      'backgroundImage',
      'backgroundSize',
      'cursor',
      'animation',
    ].includes(themeSection)
  ) {
    return (value) => (Array.isArray(value) ? value.join(', ') : value)
  }

  // For backwards compatibility reasons, before we switched to underscores
  // instead of commas for arbitrary values.
  if (['gridTemplateColumns', 'gridTemplateRows', 'objectPosition'].includes(themeSection)) {
    return (value) => (typeof value === 'string' ? postcss.list.comma(value).join(' ') : value)
  }

  if (
    [
      'backgroundColor',
      'borderColor',
      'caretColor',
      'colors',
      'divideColor',
      'fill',
      'gradientColorStops',
      'placeholderColor',
      'ringColor',
      'ringOffsetColor',
      'stroke',
      'textColor',
    ].includes(themeSection)
  ) {
    return (value) => (typeof value === 'function' ? value({}) : value)
  }

  return (value) => value
}
