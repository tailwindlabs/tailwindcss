import { describe, expect, it } from 'vitest'
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
