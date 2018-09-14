import path from 'path'

export default {
  cli: 'tailwind',
  defaultConfigFile: 'tailwind.js',
  defaultOutputFile: 'output.css',
  configStubFile: path.resolve(__dirname, '../../defaultConfig.stub.js'),
}
