import config from '../src/public/default-config'
import configStub from '../stubs/defaultConfig.stub.js'

test('the default config matches the stub', () => {
  expect(config).toEqual(configStub)
})

test('modifying the default config does not affect the stub', () => {
  config.theme = {}
  expect(config).not.toEqual(configStub)
})
