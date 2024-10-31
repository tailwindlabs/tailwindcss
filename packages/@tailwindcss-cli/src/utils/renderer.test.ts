import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { relative, wordWrap } from './renderer'
import { normalizeWindowsSeperators } from './test-helpers'

describe('relative', () => {
  it('should print an absolute path relative to the current working directory', () => {
    expect(normalizeWindowsSeperators(relative(path.resolve('index.css')))).toMatchInlineSnapshot(
      `"./index.css"`,
    )
  })

  it('should prefer the shortest value by default', () => {
    // Shortest between absolute and relative paths
    expect(normalizeWindowsSeperators(relative('index.css'))).toMatchInlineSnapshot(`"index.css"`)
  })

  it('should be possible to override the current working directory', () => {
    expect(normalizeWindowsSeperators(relative('../utils/index.css', '..'))).toMatchInlineSnapshot(
      `"./utils/index.css"`,
    )
  })

  it('should be possible to always prefer the relative path', () => {
    expect(
      normalizeWindowsSeperators(
        relative('index.css', process.cwd(), { preferAbsoluteIfShorter: false }),
      ),
    ).toMatchInlineSnapshot(`"./index.css"`)
  })
})

describe('word wrap', () => {
  it('should wrap a sentence', () => {
    expect(wordWrap('The quick brown fox jumps over the lazy dog', 10)).toMatchInlineSnapshot(`
      [
        "The quick",
        "brown fox",
        "jumps over",
        "the lazy",
        "dog",
      ]
    `)
    expect(wordWrap('The quick brown fox jumps over the lazy dog', 30)).toMatchInlineSnapshot(`
      [
        "The quick brown fox jumps over",
        "the lazy dog",
      ]
    `)
  })

  it('should wrap a sentence with ANSI escape codes', () => {
    // The ANSI escape codes are not counted in the length, but they should
    // still be rendered correctly.
    expect(
      wordWrap(
        '\x1B[31mThe\x1B[39m \x1B[32mquick\x1B[39m \x1B[34mbrown\x1B[39m \x1B[35mfox\x1B[39m jumps over the lazy dog',
        10,
      ),
    ).toMatchInlineSnapshot(`
      [
        "[31mThe[39m [32mquick[39m",
        "[34mbrown[39m [35mfox[39m",
        "jumps over",
        "the lazy",
        "dog",
      ]
    `)
  })
})
