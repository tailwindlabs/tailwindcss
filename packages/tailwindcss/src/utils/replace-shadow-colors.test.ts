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
    output: '1px 1px var(--tw-shadow-color)',
  },
  {
    input: '0 0 0 var(--my-color)',
    output: '0 0 0 var(--tw-shadow-color)',
  },
  {
    input: '1px 2px',
    output: '1px 2px var(--tw-shadow-color)',
  },
  {
    input: '1px 2px 3px',
    output: '1px 2px 3px var(--tw-shadow-color)',
  },
  {
    input: '1px 2px 3px 4px',
    output: '1px 2px 3px 4px var(--tw-shadow-color)',
  },
  {
    input: ['var(--my-shadow)', '1px 1px var(--my-color)', '0 0 1px var(--my-color)'].join(', '),
    output: [
      'var(--my-shadow)',
      '1px 1px var(--tw-shadow-color)',
      '0 0 1px var(--tw-shadow-color)',
    ].join(', '),
  },
]

it.each(table)(
  'should replace the color of box-shadow $input with $output',
  ({ input, output }) => {
    let parsed = replaceShadowColors(input, 'var(--tw-shadow-color)')
    expect(parsed).toEqual(output)
  },
)
