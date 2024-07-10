import path from 'node:path'

export function loadPlugin(inputFile: string) {
  let basePath = path.dirname(path.resolve(inputFile))

  return (pluginPath: string) => {
    if (pluginPath[0] === '.') {
      return require(path.resolve(basePath, pluginPath))
    }

    return require(pluginPath)
  }
}
