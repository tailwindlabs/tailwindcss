// @ts-config

import fs from 'fs'
import path from 'path'

export async function writeConfigs({ both = {}, inRoot = {}, inDir = {} } = {}) {
  let configs = [
    {
      path: './content.tailwind.config.js',
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
      path: './files/content.tailwind.config.js',
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

export async function destroyConfigs() {
  await fs.promises.unlink(path.resolve(__dirname, './content.tailwind.config.js'))
  await fs.promises.unlink(path.resolve(__dirname, './files/content.tailwind.config.js'))
}
