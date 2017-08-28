#!/usr/bin/env node

import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import postcss from 'postcss'
import defaultConfig from './defaultConfig'
import program from 'commander'
import tailwind from './tailwind'

let splitFileName = filename => {
  return filename.split('.')
}

let buildTailwind = config => {
  console.log('Building Tailwind!')

  fs.readFile(inputFile, (err, css) => {
    postcss([tailwind(config)])
      .process(css)
      .then(result => {
        fs.writeFileSync(outputFile, result.css)
      })
      .catch(error => console.log(error))
  })

  console.log('Finished building Tailwind!')
}

let getConfig = (customConfig, merge) => {
  if (merge) {
    return customConfig
  } else {
    return _.merge(defaultConfig, customConfig)
  }
}

program
  .version('0.1.0')
  .usage('[options] <file ...>')
  .option('-c, --config [path]', 'set config path')
  .option(
    '-r, --replace',
    'replace the built-in configuration with the provided config file'
  )
  .parse(process.argv)

let inputFile = program.args[0]

if (!inputFile) {
  console.error('No input file given!')
  process.exit(1)
}

let outputFile =
  program.args[1] || `${splitFileName(program.args[0])[0]}-output.css`

if (program.config !== undefined) {
  fs.exists(program.config, exists => {
    if (!exists) {
      console.error(`Config file [${program.config}] does not exist.`)
      process.exit(1)
    }

    fs.readFile(program.config, (err, config) => {
      if (err) {
        console.error(
          `There was a problem reading config file [${program.config}].`
        )
        process.exit(1)
      }

      const customConfig = JSON.parse(config.toString())

      let finalConfig = getConfig(customConfig, program.replace)

      buildTailwind(finalConfig)
    })
  })
} else {
  buildTailwind(defaultConfig)
}
