import path from 'path'

export const cli = 'tailwind'
export const defaultConfigFile = './tailwind.config.js'
export const defaultPostCssConfigFile = './postcss.config.js'

export const defaultConfigStubFile = path.resolve(__dirname, '../stubs/defaultConfig.stub.js')
export const simpleConfigStubFile = path.resolve(__dirname, '../stubs/simpleConfig.stub.js')
export const defaultPostCssConfigStubFile = path.resolve(
  __dirname,
  '../stubs/defaultPostCssConfig.stub.js'
)
