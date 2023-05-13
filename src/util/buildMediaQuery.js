import { splitDimensionPrefix } from './splitDimensionPrefix'

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
