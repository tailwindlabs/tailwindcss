/**
 * @param {string} value
 * @returns {[string, string]}
 */
export function splitVariantPrefix(value) {
  if (typeof value !== 'string') return ['', value]
  let parts = value.split(':')
  return ['', ...parts].slice(-2)
}

/**
 * @param {string} value
 * @returns {[string, string]}
 */
function splitDimensionPrefix(value) {
  const [prefix, extractedValue] = splitVariantPrefix(value)
  const dimension = prefix === 'h' ? 'height' : 'width'
  return [dimension, extractedValue]
}

export default function buildMediaQuery(screens) {
  screens = Array.isArray(screens) ? screens : [screens]

  return screens
    .map((screen) => {
      let values = screen.values.map((screen) => {
        if (screen.raw !== undefined) {
          return screen.raw
        }

        let [minDimension, minValue] = splitDimensionPrefix(screen.min)
        let [maxDimension, maxValue] = splitDimensionPrefix(screen.max)

        return [
          minValue && `(min-${minDimension}: ${minValue})`,
          maxValue && `(max-${maxDimension}: ${maxValue})`,
        ]
          .filter(Boolean)
          .join(' and ')
      })

      return screen.not ? `not all and ${values}` : values
    })
    .join(', ')
}
