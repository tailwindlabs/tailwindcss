import tailwind from '../src/index'
import config from '../defaultConfig.js'

test('it can accept a config file', () => {
  tailwind('./defaultConfig.js')
  expect(require('../defaultConfig.stub.js')).toEqual(config())
})
