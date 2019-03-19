import { getMissingRequiredProperties } from '../src/cli/commands/update/validator'

describe('cli update validator', () => {
  describe('getMissingRequiredProperties', () => {
    it('gets a list of missing required properties', () => {
      expect(getMissingRequiredProperties({})).toEqual(expect.arrayContaining(['options.prefix']))
    })
  })
})
