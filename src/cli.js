#!/usr/bin/env node
/* eslint-disable no-process-exit */

import path from 'path'
import fs from 'fs-extra'
import tailwind from '..'
import postcss from 'postcss'
import process from 'process'
import program from 'commander'

function loadConfig(configPath) {
  if (configPath === undefined) {
    return undefined
  }

  if (!fs.existsSync(path.resolve(configPath))) {
    console.error(`Config file [${configPath}] does not exist.`)
    process.exit(1)
  }

  return require(path.resolve(configPath))
}

function writeStrategy(options) {
  if (options.output === undefined) {
    return output => {
      process.stdout.write(output)
    }
  }
  return output => {
    fs.outputFileSync(options.output, output)
  }
}

function buildTailwind(inputFile, config, write) {
  console.log('Building Tailwind!')

  const input = fs.readFileSync(inputFile, 'utf8')

  return postcss([tailwind(config)])
    .process(input)
    .then(result => {
      write(result.css)
      console.log('Finished building Tailwind!')
    })
    .catch(error => console.log(error))
}

const packageJson = require(path.resolve(__dirname, '/../package.json'))

program.version(packageJson.version).usage('<command> [<args>]')

program
  .command('init [filename]')
  .usage('[options] [filename]')
  .action((filename = 'tailwind.js') => {
    let destination = path.resolve(filename)

    if (! path.extname(filename).includes('.js')) {
      destination += '.js'
    }

    if (fs.existsSync(destination)) {
      console.log(`Destination ${destination} already exists, aborting.`)
      process.exit(1)
    }

    const output = fs.readFileSync(
      path.resolve(__dirname, '/../defaultConfig.js'),
      'utf8'
    )
    fs.outputFileSync(
      destination,
      output.replace('// var defaultConfig', 'var defaultConfig')
    )
    process.exit()
  })

program
  .command('build')
  .usage('[options] <file ...>')
  .option('-c, --config [path]', 'Path to config file')
  .option('-o, --output [path]', 'Output file')
  .action((file, options) => {
    let inputFile = program.args[0]

    if (!inputFile) {
      console.error('No input file given!')
      process.exit(1)
    }

    buildTailwind(
      inputFile,
      loadConfig(options.config),
      writeStrategy(options)
    ).then(() => {
      process.exit()
    })
  })

program
  .command('*', null, {
    noHelp: true
  })
  .action(() => {
    program.help()
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
  process.exit()
}
