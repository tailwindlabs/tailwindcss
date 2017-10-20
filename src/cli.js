#!/usr/bin/env node

import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import postcss from 'postcss'
import defaultConfig from '../defaultConfig'
import program from 'commander'
import tailwind from '..'

function loadConfig(configPath) {
  if (configPath === undefined) {
    return undefined
  }

  if (! fs.existsSync(path.resolve(configPath))) {
    console.error(`Config file [${configPath}] does not exist.`)
    process.exit(1)
  }

  return require(path.resolve(configPath))
}

function writeStrategy(program) {
  if (program.output === undefined) {
    return (output) => {
      process.stdout.write(output)
    }
  }
  return (output) => {
    fs.writeFileSync(program.output, output)
  }
}

function buildTailwind(inputFile, config, write) {
  console.log('Building Tailwind!')

  const input = fs.readFileSync(inputFile, 'utf8')

  postcss([tailwind(config)])
    .process(input)
    .then(result => {
      write(result.css)
      console.log('Finished building Tailwind!')
    })
    .catch(error => console.log(error))
}

program.version('0.1.0')

program.command('init')
  .usage('[options] <file ...>')
  .action(function () {
    const output = fs.readFileSync(path.resolve(__dirname + '/../defaultConfig.js'), 'utf8')
    fs.writeFileSync(path.resolve('./tailwind.js'), output)
  })

program.command('build')
  .usage('[options] <file ...>')
  .option('-c, --config [path]', 'Path to config file')
  .option('-o, --output [path]', 'Output file')
  .action(function () {
    let inputFile = program.args[0]

    if (! inputFile) {
      console.error('No input file given!')
      process.exit(1)
    }

    buildTailwind(inputFile, loadConfig(program.config), writeStrategy(program))
  })

program.parse(process.argv)

const subCmd = _.get(_.head(program.args), '_name');
const cmds = _.map(program.commands, '_name');

if (!_.includes(cmds, subCmd)) {
  program.help();
  process.exit()
}
