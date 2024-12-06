import { expect, test } from 'vitest'
import flattenColorPalette from './flatten-color-palette'

test('it should handle private __CSS_VALUES__ to resolve to the right value', () => {
  expect(
    flattenColorPalette({
      'slate-100': '#000100',
      'slate-200': '#000200',
      'slate-300': '#000300',
      'slate-400': '#100400',
      'slate-500': '#100500',
      __CSS_VALUES__: {
        'slate-100': 4,
        'slate-200': 4,
        'slate-300': 4,
        'slate-400': 0,
        'slate-500': 0,
      } as any,
      slate: { '200': '#200200', '400': '#200400', '600': '#200600' },
      'slate-600': '#200600',
    }),
  ).toMatchInlineSnapshot(`
    {
      "slate-100": "#000100",
      "slate-200": "#200200",
      "slate-300": "#000300",
      "slate-400": "#100400",
      "slate-500": "#100500",
      "slate-600": "#200600",
    }
  `)
})
