let { cloneDeep } = require('./lib/util/cloneDeep')
let defaultConfig = require('./stubs/defaultConfig.stub.js')

module.exports = cloneDeep(defaultConfig.theme)
