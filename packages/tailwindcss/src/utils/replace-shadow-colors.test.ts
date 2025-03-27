import { expect, it } from 'vitest'
import { replaceShadowColors } from './replace-shadow-colors'

const table = [
  {
    input: 'var(--my-shadow)',
    output: 'var(--my-shadow)',
  },
  {
    input: '1px var(--my-shadow)',
    output: '1px var(--my-shadow)',
  },
  {
    input: '1px 1px var(--my-color)',
    output: '1px 1px var(--tw-shadow-color, var(--my-color))',
  },
  {
    input: '0 0 0 var(--my-color)',
    output: '0 0 0 var(--tw-shadow-color, var(--my-color))',
  },
  {
    input: '1px 2px',
    output: '1px 2px var(--tw-shadow-color, currentcolor)',
  },
  {
    input: '1px 2px 3px',
    output: '1px 2px 3px var(--tw-shadow-color, currentcolor)',
  },
  {
    input: '1px 2px 3px 4px',
    output: '1px 2px 3px 4px var(--tw-shadow-color, currentcolor)',
  },
  {
    input: ['var(--my-shadow)', '1px 1px var(--my-color)', '0 0 1px var(--my-color)'].join(', '),
    output: [
      'var(--my-shadow)',
      '1px 1px var(--tw-shadow-color, var(--my-color))',
      '0 0 1px var(--tw-shadow-color, var(--my-color))',
    ].join(', '),
  },
  {
    input: '1px 1px var(--my-color)',
    intensity: '50%',
    output: '1px 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%))',
  },
  {
    input: '1px 2px 3px 4px',
    intensity: '50%',
    output: '1px 2px 3px 4px var(--tw-shadow-color, oklab(from currentcolor l a b / 50%))',
  },
  {
    input: ['var(--my-shadow)', '1px 1px var(--my-color)', '0 0 1px var(--my-color)'].join(', '),
    intensity: '50%',
    output: [
      'var(--my-shadow)',
      '1px 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%))',
      '0 0 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%))',
    ].join(', '),
  },
]

it.each(table)(
  'should replace the color of box-shadow $input with $output',
  ({ input, intensity = null, output }) => {
    let parsed = replaceShadowColors(
      input,
      intensity,
      (color) => `var(--tw-shadow-color, ${color})`,
    )
    expect(parsed).toEqual(output)
  },
)
