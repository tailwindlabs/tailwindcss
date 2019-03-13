const invokeDeep = require('invoke-deep')
const cloneDeep = require('lodash/cloneDeep')
const configStub = require('./defaultConfig.stub.js')

const config = cloneDeep(configStub)
invokeDeep(config.theme)

module.exports = config
