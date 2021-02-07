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
      'backgroundColor',
      'cursor',
      'animation',
    ].includes(themeSection)
  ) {
    return (value) => (Array.isArray(value) ? value.join(', ') : value)
  }

  if (themeSection === 'colors') {
    return (value) => (typeof value === 'function' ? value({}) : value)
  }

  return (value) => value
}
