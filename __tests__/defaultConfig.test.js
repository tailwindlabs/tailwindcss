import config from '../defaultConfig.js'

test('the default config matches the stub', () => {
  expect(config()).toEqual(require('../defaultConfig.stub.js'))
})
