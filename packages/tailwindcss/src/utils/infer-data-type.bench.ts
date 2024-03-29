import { bench, expect, test } from 'vitest'
import { inferDataType } from './infer-data-type'

const colors = [
  'slateblue',
  'black',
  'orange',
  'rgb(255, 255, 255)',
  'rgba(255, 255, 255, 1)',
  'hsl(0, 0%, 100%)',
  'hsla(0, 0%, 100%, 1)',
  'hwb(0, 0%, 100%)',
  'color(red a(1))',
  'lab(0 0 0)',
  'lch(0 0 0)',
  'oklab(0 0 0)',
  'oklch(0 0 0)',
  'light-dark(#fff #000)',
  'color-mix(#fff #000)',
]

bench('colors', () => {
  for (let color of colors) {
    inferDataType(color, ['color'])
  }
})

test('colors', () => {
  for (let color of colors) {
    expect(inferDataType(color, ['color'])).toBe('color')
  }
})
