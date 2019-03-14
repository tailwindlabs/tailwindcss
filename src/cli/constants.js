import path from 'path'

export const cli = 'tailwind'
export const defaultConfigFile = 'tailwind.js'
export const defaultConfigStubFile = path.resolve(__dirname, '../../stubs/defaultConfig.stub.js')
export const simpleConfigStubFile = path.resolve(__dirname, '../../stubs/simpleConfig.stub.js')

export const replacements = [
  ["require('../plugins/container')", "require('tailwindcss/plugins/container')"],
]
