const cloneDeep = require('lodash/cloneDeep')
const defaultConfig = require('./stubs/defaultConfig.stub.js')

module.exports = cloneDeep(defaultConfig.theme)
