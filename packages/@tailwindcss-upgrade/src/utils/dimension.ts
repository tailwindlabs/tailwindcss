import { DefaultMap } from '../../../tailwindcss/src/utils/default-map'

// Parse a dimension such as `64rem` into `[64, 'rem']`.
export const dimensions = new DefaultMap((input) => {
  let match = /^(?<value>-?(?:\d*\.)?\d+)(?<unit>[a-z]+|%)$/i.exec(input)
  if (!match) return null

  let value = match.groups?.value
  if (value === undefined) return null

  let unit = match.groups?.unit
  if (unit === undefined) return null

  let valueAsNumber = Number(value)
  if (Number.isNaN(valueAsNumber)) return null

  return [valueAsNumber, unit] as const
})
