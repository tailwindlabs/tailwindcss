import config from '../defaultConfig.js'
import configStub from '../defaultConfig.stub.js'

jest.mock('../defaultConfig.stub.js', () => ({
  theme: {
    a: () => 'test',
  },
}))

test('resolves computed theme values', () => {
  expect(typeof config.theme.a).toEqual('string')
})

test('does not modify original object', () => {
  expect(typeof configStub.theme.a).toEqual('function')
})
