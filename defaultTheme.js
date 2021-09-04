let defaultConfig = require('./stubs/defaultConfig.stub.js')

module.exports = cloneDeep(defaultConfig.theme)

function cloneDeep(value) {
  if (Array.isArray(value)) {
    return value.map((child) => cloneDeep(child))
  }

  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, cloneDeep(v)]))
  }

  return value
}
