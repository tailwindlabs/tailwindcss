import path from 'path'

import * as utils from '../src/cli/utils'

describe('cli utils', () => {
  const fixture = utils.readFile(path.resolve(__dirname, 'fixtures/cli-utils.js'))

  describe('parseCliParams', () => {
    it('parses CLI parameters', () => {
      const result = utils.parseCliParams(['a', 'b', '-c', 'd'])

      expect(result).toEqual(['a', 'b'])
    })
  })

  describe('parseCliOptions', () => {
    it('parses CLI options', () => {
      const result = utils.parseCliOptions(['a', '-b', 'c'], { test: ['b'] })

      expect(result).toEqual({ test: ['c'] })
    })

    it('parses multiple types of options', () => {
      const result = utils.parseCliOptions(['a', '-b', 'c', '--test', 'd', '-test', 'e'], {
        test: ['test', 'b'],
      })

      expect(result).toEqual({ test: ['c', 'd', 'e'] })
    })

    it('ignores unknown options', () => {
      const result = utils.parseCliOptions(['a', '-b', 'c'], {})

      expect(result).toEqual({})
    })

    it('maps options', () => {
      const result = utils.parseCliOptions(['a', '-b', 'c', '-d', 'e'], { test: ['b', 'd'] })

      expect(result).toEqual({ test: ['c', 'e'] })
    })

    it('parses undefined options', () => {
      const result = utils.parseCliOptions(['a'], { test: ['b'] })

      expect(result).toEqual({ test: undefined })
    })

    it('parses flags', () => {
      const result = utils.parseCliOptions(['a', '-b'], { test: ['b'] })

      expect(result).toEqual({ test: [] })
    })

    it('accepts multiple values per option', () => {
      const result = utils.parseCliOptions(['a', '-b', 'c', 'd', '-e', 'f', '-g', 'h'], {
        test: ['b', 'g'],
      })

      expect(result).toEqual({ test: ['c', 'd', 'h'] })
    })
  })

  describe('stripBlockComments', () => {
    it('does not strip code', () => {
      const result = utils.stripBlockComments(fixture)

      expect(result).toEqual(expect.stringContaining('__code_no_comment__'))
      expect(result).toEqual(expect.stringContaining('__code_comment_line__'))
      expect(result).toEqual(expect.stringContaining('__code_comment_block__'))
      expect(result).toEqual(expect.stringContaining('__code_comment_line_important__'))
      expect(result).toEqual(expect.stringContaining('__code_comment_block_important__'))
    })

    it('strips block comments', () => {
      const result = utils.stripBlockComments(fixture)

      expect(result).not.toEqual(expect.stringContaining('__comment_block__'))
      expect(result).not.toEqual(expect.stringContaining('__comment_block_multiline__'))
      expect(result).not.toEqual(expect.stringContaining('__comment_block_code__'))
    })

    it('strips docblock comments', () => {
      const result = utils.stripBlockComments(fixture)

      expect(result).not.toEqual(expect.stringContaining('__comment_docblock__'))
    })

    it('does not strip line comments', () => {
      const result = utils.stripBlockComments(fixture)

      expect(result).toEqual(expect.stringContaining('__comment_line__'))
      expect(result).toEqual(expect.stringContaining('__comment_line_important__'))
      expect(result).toEqual(expect.stringContaining('__comment_line_code__'))
      expect(result).toEqual(expect.stringContaining('__comment_line_important_code__'))
    })

    it('does not strip important block comments', () => {
      const result = utils.stripBlockComments(fixture)

      expect(result).toEqual(expect.stringContaining('__comment_block_important__'))
      expect(result).toEqual(expect.stringContaining('__comment_block_multiline_important__'))
      expect(result).toEqual(expect.stringContaining('__comment_block_important_code__'))
    })

    it('does not strip important docblock comments', () => {
      const result = utils.stripBlockComments(fixture)

      expect(result).toEqual(expect.stringContaining('__comment_docblock_important__'))
    })
  })

  describe('replaceAll', () => {
    it('replaces strings', () => {
      const result = utils.replaceAll('test', [['test', 'pass']])

      expect(result).toEqual('pass')
    })

    it('replaces regex patterns', () => {
      const result = utils.replaceAll('TEST', [[/test/i, 'pass']])

      expect(result).toEqual('pass')
    })

    it('replaces all matches', () => {
      const result = utils.replaceAll('test test', [['test', 'pass']])

      expect(result).toEqual('pass pass')
    })

    it('replaces all multiple patterns', () => {
      const result = utils.replaceAll('hello world', [['hello', 'greetings'], ['world', 'earth']])

      expect(result).toEqual('greetings earth')
    })
  })
})
