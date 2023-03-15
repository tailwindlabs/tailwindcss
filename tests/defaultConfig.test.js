import config from '../src/public/default-config'
import configStub from '../stubs/config.full'

test.todo('remove mutation from these tests so we can run against both engines')

test('the default config matches the stub', () => {
  expect(config).toEqual(configStub)
})

test('modifying the default config does not affect the stub', () => {
  config.theme = {}
  expect(config).not.toEqual(configStub)
})
