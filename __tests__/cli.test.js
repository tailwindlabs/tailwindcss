import path from 'path'

import cli from '../src/cli/main.js'
import constants from '../src/cli/constants.js'
import * as utils from '../src/cli/utils.js'

describe('cli', () => {
  const inputCssPath = path.resolve(__dirname, 'fixtures/tailwind-input.css')
  const customConfigPath = path.resolve(__dirname, 'fixtures/custom-config.js')

  beforeEach(() => {
    utils.log = jest.fn()
    utils.writeFile = jest.fn()
  })

  describe('init', () => {
    it('creates a Tailwind config file', () => {
      cli(['init'])
      expect(utils.writeFile.mock.calls[0][0]).toEqual(constants.defaultConfigFile)
      expect(utils.writeFile.mock.calls[0][1]).toContain('defaultConfig')
    })

    it('creates a Tailwind config file in a custom location', () => {
      cli(['init', 'custom.js'])
      expect(utils.writeFile.mock.calls[0][0]).toEqual('custom.js')
      expect(utils.writeFile.mock.calls[0][1]).toContain('defaultConfig')
    })
  })

  describe('build', () => {
    it('compiles CSS file', () => {
      cli(['build', inputCssPath])
      expect(utils.writeFile.mock.calls[0][0]).toEqual(constants.defaultOutputFile)
      expect(utils.writeFile.mock.calls[0][1]).toContain('.example')
    })

    it('compiles CSS file using custom configuration', () => {
      cli(['build', inputCssPath, '--config', customConfigPath])
      expect(utils.writeFile.mock.calls[0][0]).toEqual(constants.defaultOutputFile)
      expect(utils.writeFile.mock.calls[0][1]).toContain('400px')
    })

    it('creates compiled CSS file in a custom location', () => {
      cli(['build', inputCssPath, '--output', 'custom.css'])
      expect(utils.writeFile.mock.calls[0][0]).toEqual('custom.css')
      expect(utils.writeFile.mock.calls[0][1]).toContain('.example')
    })
  })
})
