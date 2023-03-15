import theme from '../src/public/default-theme'
import configStub from '../stubs/config.full.js'

test.todo('remove mutation from these tests so we can run against both engines')

test('the default theme matches the stub', () => {
  expect(theme).toEqual(configStub.theme)
})

test('modifying the default theme does not affect the stub', () => {
  theme.colors = {}
  expect(theme).not.toEqual(configStub.theme)
})
