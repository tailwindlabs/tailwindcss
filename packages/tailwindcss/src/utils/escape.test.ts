import { describe, expect, test } from 'vitest'
import { escape, unescape } from './escape'

describe('escape', () => {
  test('adds backslashes', () => {
    expect(escape(String.raw`red-1/2`)).toMatchInlineSnapshot(`"red-1\\/2"`)
  })
})

describe('unescape', () => {
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
