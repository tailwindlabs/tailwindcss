#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import defaultConfig from './defaultConfig'
import program from 'commander'
import tailwind from './tailwind'

let splitFileName = filename => {
  return filename.split('.')
}

program
  .version('0.1.0')
  .usage('[options] <file ...>')
  .option('-c, --config [value]', 'Pass custom configuration')
  .parse(process.argv)

let inputFile = program.args[0]

if (!inputFile) {
  console.error('No input file given!')
  process.exit(1)
}

let outputFile =
  program.args[1] || `${splitFileName(program.args[0])[0]}-output.css`

fs.readFile(path.join(program.config), (err, config) => {
  if (err) {
    console.error(`config file ${program.config} does not exist`)
    process.exit(1)
  }

  const customConfig = JSON.parse(config.toString())

  let finalConfig = {
    ...defaultConfig,
    ...customConfig,
  }

  console.log('Building Tailwind!')

  fs.readFile(inputFile, (err, css) => {
    postcss([tailwind(finalConfig)])
      .process(css)
      .then(result => {
        fs.writeFileSync(outputFile, result.css)
      })
      .catch(error => console.log(error))
  })

  console.log('Finished building Tailwind!')
})
