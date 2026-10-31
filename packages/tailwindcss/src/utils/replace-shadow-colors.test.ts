import { describe, expect, it } from 'vitest'
import { cartesian } from '../cartesian'
import { replaceAlpha } from '../utilities'
import { replaceShadowColors } from './replace-shadow-colors'

describe('without replacer', () => {
  let replacer = (color: string) => `var(--tw-shadow-color, ${color})`

  it('should handle var shadow', () => {
    let parsed = replaceShadowColors('var(--my-shadow)', replacer)
    expect(parsed).toMatchInlineSnapshot(`"var(--my-shadow)"`)
  })

  it('should handle var shadow with offset', () => {
    let parsed = replaceShadowColors('1px var(--my-shadow)', replacer)
    expect(parsed).toMatchInlineSnapshot(`"1px var(--my-shadow)"`)
  })

  it('should handle var color with offsets', () => {
    let parsed = replaceShadowColors('1px 1px var(--my-color)', replacer)
    expect(parsed).toMatchInlineSnapshot(`"1px 1px var(--tw-shadow-color, var(--my-color))"`)
  })

  it('should handle var color with zero offsets', () => {
    let parsed = replaceShadowColors('0 0 0 var(--my-color)', replacer)
    expect(parsed).toMatchInlineSnapshot(`"0 0 0 var(--tw-shadow-color, var(--my-color))"`)
  })

  it('should handle two values with currentcolor', () => {
    let parsed = replaceShadowColors('1px 2px', replacer)
    expect(parsed).toMatchInlineSnapshot(`"1px 2px var(--tw-shadow-color, currentcolor)"`)
  })

  it('should handle three values with currentcolor', () => {
    let parsed = replaceShadowColors('1px 2px 3px', replacer)
    expect(parsed).toMatchInlineSnapshot(`"1px 2px 3px var(--tw-shadow-color, currentcolor)"`)
  })

  it('should handle four values with currentcolor', () => {
    let parsed = replaceShadowColors('1px 2px 3px 4px', replacer)
    expect(parsed).toMatchInlineSnapshot(`"1px 2px 3px 4px var(--tw-shadow-color, currentcolor)"`)
  })

  it('should find the color regardless of its position', () => {
    for (let [x, y, blur, spread, color] of cartesian(
      ['calc(var(--spacing) * 1)', '1', '--spacing(1)'], // x
      ['calc(var(--spacing) * 2)', '2', '--spacing(2)'], // y
      ['calc(var(--spacing) * 3)', '3', '--spacing(3)'], // blur
      ['calc(var(--spacing) * 4)', '4', '--spacing(4)'], // spread
      ['black', 'rgb(0, 0, 0)', '#000', '--alpha(var(--color) / 50%)', 'var(--uknown-color)'], // color
    )) {
      let expectedColor = `var(--tw-shadow-color, ${color})`

      {
        let input = `${x} ${color} ${y} ${blur} ${spread}`
        expect(replaceShadowColors(input, replacer)).toEqual(input.replace(color, expectedColor))
      }

      {
        let input = `${x} ${y} ${color} ${blur} ${spread}`
        expect(replaceShadowColors(input, replacer)).toEqual(input.replace(color, expectedColor))
      }

      {
        let input = `${x} ${y} ${blur} ${color} ${spread}`
        expect(replaceShadowColors(input, replacer)).toEqual(input.replace(color, expectedColor))
      }
    }
  })

  // When using `var(…)`, we don't know the types of the used variables, but we
  // might be able to find the color itself.
  it.each([
    'black', // Named color
    '#000', // Hex color
    'rgb(0, 0, 0)', // Color functions
    '--alpha(var(--color) / 50%)', // Known custom functions
  ])('should find the color (%s)', (color) => {
    let expectedColor = `var(--tw-shadow-color, ${color})`

    {
      let input = `var(--x) var(--y) ${color}`
      expect(replaceShadowColors(input, replacer)).toEqual(input.replace(color, expectedColor))
    }

    {
      let input = `var(--x) var(--y) var(--blur) ${color}`
      expect(replaceShadowColors(input, replacer)).toEqual(input.replace(color, expectedColor))
    }

    {
      let input = `var(--x) var(--y) var(--blur) var(--spread) ${color}`
      expect(replaceShadowColors(input, replacer)).toEqual(input.replace(color, expectedColor))
    }
  })

  it('should handle multiple shadows', () => {
    let parsed = replaceShadowColors(
      ['var(--my-shadow)', '1px 1px var(--my-color)', '0 0 1px var(--my-color)'].join(', '),
      replacer,
    )
    expect(parsed).toMatchInlineSnapshot(
      `"var(--my-shadow), 1px 1px var(--tw-shadow-color, var(--my-color)), 0 0 1px var(--tw-shadow-color, var(--my-color))"`,
    )
  })
})

describe('with replacer', () => {
  let replacer = (color: string) => `var(--tw-shadow-color, ${replaceAlpha(color, '50%')})`

  it('should handle var color with intensity', () => {
    let parsed = replaceShadowColors('1px 1px var(--my-color)', replacer)
    expect(parsed).toMatchInlineSnapshot(
      `"1px 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%))"`,
    )
  })

  it('should handle box-shadow with intensity', () => {
    let parsed = replaceShadowColors('1px 1px var(--my-color)', replacer)
    expect(parsed).toMatchInlineSnapshot(
      `"1px 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%))"`,
    )
  })

  it('should handle four values with intensity and no color value', () => {
    let parsed = replaceShadowColors('1px 2px 3px 4px', replacer)
    expect(parsed).toMatchInlineSnapshot(
      `"1px 2px 3px 4px var(--tw-shadow-color, oklab(from currentcolor l a b / 50%))"`,
    )
  })

  it('should handle multiple shadows with intensity', () => {
    let parsed = replaceShadowColors(
      ['var(--my-shadow)', '1px 1px var(--my-color)', '0 0 1px var(--my-color)'].join(', '),
      replacer,
    )
    expect(parsed).toMatchInlineSnapshot(
      `"var(--my-shadow), 1px 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%)), 0 0 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%))"`,
    )
  })
})
