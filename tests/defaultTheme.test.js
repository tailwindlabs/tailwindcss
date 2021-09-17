import theme from '../src/public/default-theme'
import configStub from '../stubs/defaultConfig.stub.js'

test('the default theme matches the stub', () => {
  expect(theme).toEqual(configStub.theme)
})

test('modifying the default theme does not affect the stub', () => {
  theme.colors = {}
  expect(theme).not.toEqual(configStub.theme)
})
