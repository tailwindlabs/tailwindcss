import { expect, it } from 'vitest'
import { toCss } from '../ast'
import { replaceShadowColors } from './replace-shadow-colors'

const table = [
  {
    input: ['text-shadow', 'var(--my-shadow)'],
    output: 'text-shadow: var(--my-shadow);',
  },
  {
    input: ['text-shadow', '1px var(--my-shadow)'],
    output: 'text-shadow: 1px var(--my-shadow);',
  },
  {
    input: ['text-shadow', '1px 1px var(--my-color)'],
    output: 'text-shadow: 1px 1px var(--tw-shadow-color, var(--my-color));',
  },
  {
    input: ['text-shadow', '0 0 0 var(--my-color)'],
    output: 'text-shadow: 0 0 0 var(--tw-shadow-color, var(--my-color));',
  },
  {
    input: ['text-shadow', '1px 2px'],
    output: 'text-shadow: 1px 2px var(--tw-shadow-color, currentcolor);',
  },
  {
    input: ['text-shadow', '1px 2px 3px'],
    output: 'text-shadow: 1px 2px 3px var(--tw-shadow-color, currentcolor);',
  },
  {
    input: ['text-shadow', '1px 2px 3px 4px'],
    output: 'text-shadow: 1px 2px 3px 4px var(--tw-shadow-color, currentcolor);',
  },
  {
    input: [
      'text-shadow',
      ['var(--my-shadow)', '1px 1px var(--my-color)', '0 0 1px var(--my-color)'].join(', '),
    ],
    output: `text-shadow: ${[
      'var(--my-shadow)',
      '1px 1px var(--tw-shadow-color, var(--my-color))',
      '0 0 1px var(--tw-shadow-color, var(--my-color))',
    ].join(', ')};`,
  },
  {
    input: ['text-shadow', '1px 1px var(--my-color)'],
    intensity: '50%',
    output: 'text-shadow: 1px 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%));',
  },
  {
    input: ['text-shadow', '1px 2px 3px 4px'],
    intensity: '50%',
    output:
      'text-shadow: 1px 2px 3px 4px var(--tw-shadow-color, oklab(from currentcolor l a b / 50%));',
  },
  {
    input: [
      'text-shadow',
      ['var(--my-shadow)', '1px 1px var(--my-color)', '0 0 1px var(--my-color)'].join(', '),
    ],
    intensity: '50%',
    output: `text-shadow: ${[
      'var(--my-shadow)',
      '1px 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%))',
      '0 0 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%))',
    ].join(', ')};`,
  },
]

it.each(table)(
  'should replace the color of box-shadow $input with $output',
  ({ input, intensity = null, output }) => {
    let parsed = replaceShadowColors(
      input[0],
      input[1],
      intensity,
      (color) => `var(--tw-shadow-color, ${color})`,
    )
    expect(toCss(parsed).trim()).toEqual(output)
  },
)
