import path from 'node:path'

export function loadPlugin(basePath: string) {
  return (pluginPath: string) => {
    if (pluginPath[0] === '.') {
      return require(path.resolve(basePath, pluginPath))
    }

    return require(pluginPath)
  }
}
