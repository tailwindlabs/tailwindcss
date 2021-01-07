import buildMediaQuery from '../src/util/buildMediaQuery'

describe('buildMediaQuery', () => {
  describe('parameter string', () => {
    it('definition as string', () => {
      expect(buildMediaQuery('640px')).toEqual('(min-width: 640px)')
    })

    it('string empty', () => {
      expect(buildMediaQuery('')).toEqual(undefined)
    })

    it('undefined', () => {
      expect(buildMediaQuery(undefined)).toEqual(undefined)
    })

    it('null', () => {
      expect(buildMediaQuery(null)).toEqual(undefined)
    })
  })

  describe('parameter simple object', () => {
    it('with min value', () => {
      expect(
        buildMediaQuery({
          min: '640px',
        })
      ).toEqual('(min-width: 640px)')
    })

    it('with min-value value', () => {
      expect(
        buildMediaQuery({
          'min-width': '640px',
        })
      ).toEqual('(min-width: 640px)')
    })

    it('with min and max value', () => {
      expect(
        buildMediaQuery({
          min: '640px',
          max: '767.98px',
        })
      ).toEqual('(min-width: 640px) and (max-width: 767.98px)')
    })

    it('with orientation value', () => {
      expect(
        buildMediaQuery({
          orientation: 'portrait',
        })
      ).toEqual('(orientation: portrait)')
    })

    it('with raw value', () => {
      expect(
        buildMediaQuery({
          raw: 'print and (orientation: portrait)',
        })
      ).toEqual('print and (orientation: portrait)')
    })
  })

  describe('parameter complex object', () => {
    it('with multiple set of values', () => {
      expect(
        buildMediaQuery([
          {
            min: '668px',
            max: '767px',
          },
          {
            min: '868px',
          },
        ])
      ).toEqual('(min-width: 668px) and (max-width: 767px), (min-width: 868px)')
    })
  })
})
