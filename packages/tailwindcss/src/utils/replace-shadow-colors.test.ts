import { expect, it } from 'vitest'
import { replaceShadowColors } from './replace-shadow-colors'

const table = [
  {
    input: ['var(--my-shadow)'],
    output: 'var(--my-shadow)',
  },
  {
    input: ['1px var(--my-shadow)'],
    output: '1px var(--my-shadow)',
  },
  {
    input: ['1px 1px var(--my-color)'],
    output: '1px 1px var(--tw-shadow-color)',
  },
  {
    input: ['0 0 0 var(--my-color)'],
    output: '0 0 0 var(--tw-shadow-color)',
  },
  {
    input: ['var(--my-shadow)', '1px 1px var(--my-color)', '0 0 1px var(--my-color)'],
    output: [
      'var(--my-shadow)',
      '1px 1px var(--tw-shadow-color)',
      '0 0 1px var(--tw-shadow-color)',
    ].join(', '),
  },
]

it.each(table)(
  'should be possible to get the names for an animation: $output',
  ({ input, output }) => {
    let parsed = replaceShadowColors(input.join(', '), 'var(--tw-shadow-color)')
    expect(parsed).toEqual(output)
  },
)
