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
})
