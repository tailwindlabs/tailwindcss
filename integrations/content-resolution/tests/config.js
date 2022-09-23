// @ts-config

let fs = require('fs')
let path = require('path')

module.exports.writeConfigs = async function writeConfigs({
  both = {},
  inRoot = {},
  inDir = {},
} = {}) {
  let configs = [
    {
      path: '../tailwind.config.js',
      config: {
        ...both,
        ...inRoot,
        content: {
          files: [],
          ...both.content,
          ...inRoot.content,
        },
      },
    },
    {
      path: '../src/tailwind.config.js',
      config: {
        ...both,
        ...inDir,
        content: {
          files: [],
          ...both.content,
          ...inDir.content,
        },
      },
    },
  ]

  let defaultConfig = {
    corePlugins: { preflight: false },
  }

  for (const config of configs) {
    await fs.promises.writeFile(
      path.resolve(__dirname, config.path),
      `module.exports = ${JSON.stringify({ ...defaultConfig, ...config.config })};`
    )
  }
}

module.exports.destroyConfigs = async function destroyConfigs() {
  await fs.promises.unlink(path.resolve(__dirname, '../tailwind.config.js'))
  await fs.promises.unlink(path.resolve(__dirname, '../src/tailwind.config.js'))
}
