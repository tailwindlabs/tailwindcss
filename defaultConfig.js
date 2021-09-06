let { cloneDeep } = require('./src/util/cloneDeep')
let defaultConfig = require('./stubs/defaultConfig.stub.js')

module.exports = cloneDeep(defaultConfig)
