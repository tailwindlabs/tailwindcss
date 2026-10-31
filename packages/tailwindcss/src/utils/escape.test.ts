import { describe, expect, test } from 'vitest'
import { escape, unescape } from './escape'

describe('escape', () => {
  test('adds backslashes', () => {
    expect(escape(String.raw`red-1/2`)).toMatchInlineSnapshot(`"red-1\\/2"`)
  })
})

describe('unescape', () => {
  test.each([
    [String.raw`\0`, '\uFFFD'],
    [String.raw`\1`, '\u0001'],
    [String.raw`\9`, '\t'],
    [String.raw`\a`, '\n'],
    [String.raw`\A`, '\n'],
    [String.raw`\c`, '\f'],
    [String.raw`\C`, '\f'],
    [String.raw`\f`, '\u000f'],
    [String.raw`\F`, '\u000f'],
  ])('decodes a single hexadecimal digit in %s', (input, expected) => {
    expect(unescape(input)).toBe(expected)
  })

  test.each([
    [String.raw`\a b`, '\nb'],
    [String.raw`\00000a`, '\n'],
    [String.raw`\41`, 'A'],
    [String.raw`\0 `, '\uFFFD'],
    [String.raw`\!`, '!'],
    [String.raw`\g`, 'g'],
    [String.raw`\\`, '\\'],
  ])('preserves escape handling in %s', (input, expected) => {
    expect(unescape(input)).toBe(expected)
  })

  test('removes backslashes', () => {
    expect(unescape(String.raw`red-1\/2`)).toMatchInlineSnapshot(`"red-1/2"`)
  })

  test('replaces out-of-range escaped code points', () => {
    expect(
      unescape(
        String.raw`--Coding-Projects-CharacterMapper-Master-Workspace\d8819554-4725-4235-9d22-2d0ed572e924`,
      ),
    ).toMatchInlineSnapshot(
      `"--Coding-Projects-CharacterMapper-Master-Workspace�54-4725-4235-9d22-2d0ed572e924"`,
    )
  })
})
