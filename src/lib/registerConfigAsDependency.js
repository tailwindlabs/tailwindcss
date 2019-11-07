import fs from 'fs'
import getModuleDependencies from './getModuleDependencies'

export default function(configFile) {
  if (!fs.existsSync(configFile)) {
    throw new Error(`Specified Tailwind config file "${configFile}" doesn't exist.`)
  }

  return function(css, opts) {
    getModuleDependencies(configFile).forEach(mdl => {
      opts.messages.push({
        type: 'dependency',
        parent: css.source.input.file,
        file: mdl.file,
      })
    })
  }
}
