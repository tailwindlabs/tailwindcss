import path from 'path'

export const cli = 'tailwind'
export const defaultConfigFile = './tailwind.config.js'
export const defaultConfigStubFile = path.resolve(__dirname, '../stubs/defaultConfig.stub.js')
export const simpleConfigStubFile = path.resolve(__dirname, '../stubs/simpleConfig.stub.js')

// These are used by the update process
export const oldDefaultConfigFile = './tailwind.js'
export const oldDefaultConfigStubFile = path.resolve(__dirname, '../stubs/oldDefaultConfig.stub.js')
