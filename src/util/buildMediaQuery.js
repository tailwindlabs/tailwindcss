export default function buildMediaQuery(screens) {
  if (typeof screens === 'string') {
    screens = { min: screens }
  }

  if (!Array.isArray(screens)) {
    screens = [screens]
  }

  return screens
    .map((screen) => {
      if (screen?.hasOwnProperty?.('raw')) {
        return screen.raw
      }

      return Object.entries(screen)
        .map(([feature, value]) => {
          feature = { min: 'min-width', max: 'max-width' }[feature] ?? feature
          return `(${feature}: ${value})`
        })
        .join(' and ')
    })
    .join(', ')
}
