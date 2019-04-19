import fs from 'fs'

export default configFile => {
  if (!fs.existsSync(configFile)) {
    throw new Error(`Specified Tailwind config file "${configFile}" doesn't exist.`)
  }

  return (css, opts) => {
    opts.messages.push({
      type: 'dependency',
      file: configFile,
      parent: css.source.input.file,
    })
  }
}
