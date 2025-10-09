import { DefaultMap } from '../../../tailwindcss/src/utils/default-map'

const DIMENSION_REGEX = /^(?<value>[-+]?(?:\d*\.)?\d+)(?<unit>[a-z]+|%)?$/i

// Parse a dimension such as `64rem` into `[64, 'rem']`.
export const dimensions = new DefaultMap((input) => {
  let match = DIMENSION_REGEX.exec(input)
  if (!match) return null

  let value = match.groups?.value
  if (value === undefined) return null

  let valueAsNumber = Number(value)
  if (Number.isNaN(valueAsNumber)) return null

  let unit = match.groups?.unit
  if (unit === undefined) return [valueAsNumber, null] as const

  return [valueAsNumber, unit] as const
})
