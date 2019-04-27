import * as utils from '../src/cli/utils'

describe('cli utils', () => {
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

  describe('getSimplePath', () => {
    it('strips leading ./', () => {
      const result = utils.getSimplePath('./test')

      expect(result).toEqual('test')
    })

    it('returns unchanged path if it does not begin with ./', () => {
      const result = utils.getSimplePath('../test')

      expect(result).toEqual('../test')
    })
  })
})
