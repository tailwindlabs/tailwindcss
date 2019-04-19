import path from 'path'

import cli from '../src/cli/main'
import * as constants from '../src/constants'
import * as utils from '../src/cli/utils'
import runInTempDirectory from '../jest/runInTempDirectory'

describe('cli', () => {
  const inputCssPath = path.resolve(__dirname, 'fixtures/tailwind-input.css')
  const customConfigPath = path.resolve(__dirname, 'fixtures/custom-config.js')
  const defaultConfigFixture = utils.readFile(constants.defaultConfigStubFile)
  const simpleConfigFixture = utils.readFile(constants.simpleConfigStubFile)

  beforeEach(() => {
    console.log = jest.fn()
    process.stdout.write = jest.fn()
  })

  describe('init', () => {
    test('creates a Tailwind config file', () =>
      runInTempDirectory(() =>
        cli(['init']).then(() => {
          expect(utils.readFile(constants.defaultConfigFile)).toEqual(simpleConfigFixture)
        })
      ))

    test('creates a full Tailwind config file', () =>
      runInTempDirectory(() =>
        cli(['init', '--full']).then(() => {
          expect(utils.readFile(constants.defaultConfigFile)).toEqual(defaultConfigFixture)
        })
      ))

    test('creates a Tailwind config file in a custom location', () =>
      runInTempDirectory(() =>
        cli(['init', 'custom.js']).then(() => {
          expect(utils.exists('custom.js')).toEqual(true)
        })
      ))
  })

  describe('build', () => {
    test('compiles CSS file', () =>
      cli(['build', inputCssPath]).then(() => {
        expect(process.stdout.write.mock.calls[0][0]).toContain('.example')
      }))

    test('compiles CSS file using custom configuration', () =>
      cli(['build', inputCssPath, '--config', customConfigPath]).then(() => {
        expect(process.stdout.write.mock.calls[0][0]).toContain('400px')
      }))

    test('creates compiled CSS file', () =>
      runInTempDirectory(() =>
        cli(['build', inputCssPath, '--output', 'output.css']).then(() => {
          expect(utils.readFile('output.css')).toContain('.example')
        })
      ))

    test('compiles CSS file with autoprefixer', () =>
      cli(['build', inputCssPath]).then(() => {
        expect(process.stdout.write.mock.calls[0][0]).toContain('-ms-input-placeholder')
      }))

    test('compiles CSS file without autoprefixer', () =>
      cli(['build', inputCssPath, '--no-autoprefixer']).then(() => {
        expect(process.stdout.write.mock.calls[0][0]).not.toContain('-ms-input-placeholder')
      }))
  })
})
