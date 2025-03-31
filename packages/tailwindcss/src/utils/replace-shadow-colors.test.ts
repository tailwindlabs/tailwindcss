import { expect, it } from 'vitest'
import { toCss } from '../ast'
import { replaceShadowColors } from './replace-shadow-colors'

it('should handle var shadow', () => {
  let parsed = replaceShadowColors(
    'text-shadow',
    'var(--my-shadow)',
    null,
    (color) => `var(--tw-shadow-color, ${color})`,
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot('"text-shadow: var(--my-shadow);"')
})

it('should handle var shadow with offset', () => {
  let parsed = replaceShadowColors(
    'text-shadow',
    '1px var(--my-shadow)',
    null,
    (color) => `var(--tw-shadow-color, ${color})`,
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot('"text-shadow: 1px var(--my-shadow);"')
})

it('should handle var color with offsets', () => {
  let parsed = replaceShadowColors(
    'text-shadow',
    '1px 1px var(--my-color)',
    null,
    (color) => `var(--tw-shadow-color, ${color})`,
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot(
    `
    "text-shadow: 1px 1px var(--tw-shadow-color, var(--my-color));"
  `,
  )
})

it('should handle var color with zero offsets', () => {
  let parsed = replaceShadowColors(
    'text-shadow',
    '0 0 0 var(--my-color)',
    null,
    (color) => `var(--tw-shadow-color, ${color})`,
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot(
    `
    "text-shadow: 0 0 0 var(--tw-shadow-color, var(--my-color));"
  `,
  )
})

it('should handle two values with currentcolor', () => {
  let parsed = replaceShadowColors(
    'text-shadow',
    '1px 2px',
    null,
    (color) => `var(--tw-shadow-color, ${color})`,
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot(
    `
    "text-shadow: 1px 2px var(--tw-shadow-color, currentcolor);"
  `,
  )
})

it('should handle three values with currentcolor', () => {
  let parsed = replaceShadowColors(
    'text-shadow',
    '1px 2px 3px',
    null,
    (color) => `var(--tw-shadow-color, ${color})`,
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot(
    `
    "text-shadow: 1px 2px 3px var(--tw-shadow-color, currentcolor);"
  `,
  )
})

it('should handle four values with currentcolor', () => {
  let parsed = replaceShadowColors(
    'text-shadow',
    '1px 2px 3px 4px',
    null,
    (color) => `var(--tw-shadow-color, ${color})`,
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot(
    `
    "text-shadow: 1px 2px 3px 4px var(--tw-shadow-color, currentcolor);"
  `,
  )
})

it('should handle multiple shadows', () => {
  let parsed = replaceShadowColors(
    'text-shadow',
    ['var(--my-shadow)', '1px 1px var(--my-color)', '0 0 1px var(--my-color)'].join(', '),
    null,
    (color) => `var(--tw-shadow-color, ${color})`,
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot(
    `
    "text-shadow: var(--my-shadow), 1px 1px var(--tw-shadow-color, var(--my-color)), 0 0 1px var(--tw-shadow-color, var(--my-color));"
  `,
  )
})

it('should handle var color with intensity', () => {
  let parsed = replaceShadowColors(
    'text-shadow',
    '1px 1px var(--my-color)',
    '50%',
    (color) => `var(--tw-shadow-color, ${color})`,
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot(
    `
    "text-shadow: 1px 1px var(--tw-shadow-color, var(--my-color));
    @supports (color: lab(from red l a b)) {
      text-shadow: 1px 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%));
    }"
  `,
  )
})

it('should handle box-shadow with intensity', () => {
  let parsed = replaceShadowColors(
    'box-shadow',
    '1px 1px var(--my-color)',
    '50%',
    (color) => `var(--tw-shadow-color, ${color})`,
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot(
    `
    "box-shadow: 1px 1px var(--tw-shadow-color, var(--my-color));
    @supports (color: lab(from red l a b)) {
      box-shadow: 1px 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%));
    }"
  `,
  )
})

it('should handle box-shadow with inset prefix and intensity', () => {
  let parsed = replaceShadowColors(
    'box-shadow',
    '1px 1px var(--my-color)',
    '50%',
    (color) => `var(--tw-shadow-color, ${color})`,
    'inset ',
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot(
    `
    "box-shadow: inset 1px 1px var(--tw-shadow-color, var(--my-color));
    @supports (color: lab(from red l a b)) {
      box-shadow: inset 1px 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%));
    }"
  `,
  )
})

it('should handle four values with intensity and no color value', () => {
  let parsed = replaceShadowColors(
    'text-shadow',
    '1px 2px 3px 4px',
    '50%',
    (color) => `var(--tw-shadow-color, ${color})`,
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot(
    `"text-shadow: 1px 2px 3px 4px var(--tw-shadow-color, color-mix(in oklab, currentcolor 50%, transparent));"`,
  )
})

it('should handle multiple shadows with intensity', () => {
  let parsed = replaceShadowColors(
    'text-shadow',
    ['var(--my-shadow)', '1px 1px var(--my-color)', '0 0 1px var(--my-color)'].join(', '),
    '50%',
    (color) => `var(--tw-shadow-color, ${color})`,
  )
  expect(toCss(parsed).trim()).toMatchInlineSnapshot(
    `
    "text-shadow: var(--my-shadow), 1px 1px var(--tw-shadow-color, var(--my-color)), 0 0 1px var(--tw-shadow-color, var(--my-color));
    @supports (color: lab(from red l a b)) {
      text-shadow: var(--my-shadow), 1px 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%)), 0 0 1px var(--tw-shadow-color, oklab(from var(--my-color) l a b / 50%));
    }"
  `,
  )
})
