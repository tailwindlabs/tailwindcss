import fs from 'fs'

export default function(configFile) {
  if (!fs.existsSync(configFile)) {
    throw new Error(`Specified Tailwind config file "${configFile}" doesn't exist.`)
  }

  return function(css, opts) {
    opts.messages.push({
      type: 'dependency',
      file: configFile,
      parent: css.source.input.file,
    })
  }
}
