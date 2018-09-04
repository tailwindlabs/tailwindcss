#!/usr/bin/env node
/* eslint-disable no-process-exit */

import path from 'path'
import fs from 'fs-extra'
import tailwind from '..'
import autoprefixer from 'autoprefixer'
import CleanCSS from 'clean-css'
import glob from 'glob'
import postcss from 'postcss'
import process from 'process'
import program from 'commander'
import PurgeCSS from 'purgecss'
import TailwindExtractor from './TailwindExtractor.js'

function flatten(arr) {
  return [].concat(...arr)
}

function reduceOption(item, arr) {
  arr.push(item)
  return arr
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

function purge(content, css) {
  const files = flatten(content.map(pattern => glob.sync(pattern)))

  return new PurgeCSS({
    content,
    css: [{ raw: css }],
    extractors: [
      {
        extractor: TailwindExtractor,
        extensions: files, // Apply the extractor to all content files
      },
    ],
  }).purge()[0].css
}

function minify(css) {
  return new CleanCSS().minify(css).styles
}

function buildTailwind(inputFile, options, write) {
  console.warn('Building Tailwind!')

  const input = fs.readFileSync(inputFile, 'utf8')

  return postcss([tailwind(options.config), autoprefixer])
    .process(input, { from: inputFile })
    .then(result => result.css)
    .then(result => (options.purge.length ? purge(options.purge, result) : result))
    .then(result => (options.minify ? minify(result) : result))
    .then(result => {
      write(result)
      console.warn('Finished building Tailwind!')
    })
    .catch(error => console.error(error))
}

const packageJson = require(path.resolve(__dirname, '../package.json'))

program.version(packageJson.version).usage('<command> [<args>]')

program
  .command('init [filename]')
  .usage('[options] [filename]')
  .action((filename = 'tailwind.js') => {
    let destination = path.resolve(filename)

    if (!path.extname(filename).includes('.js')) {
      destination += '.js'
    }

    if (fs.existsSync(destination)) {
      console.error(`Destination ${destination} already exists, aborting.`)
      process.exit(1)
    }

    const output = fs.readFileSync(path.resolve(__dirname, '../defaultConfig.stub.js'), 'utf8')
    fs.outputFileSync(destination, output.replace('// let defaultConfig', 'let defaultConfig'))
    fs.outputFileSync(
      destination,
      output.replace("require('./plugins/container')", "require('tailwindcss/plugins/container')")
    )
    console.warn(`Generated Tailwind config: ${destination}`)
    process.exit()
  })

program
  .command('build')
  .usage('[options] <file ...>')
  .option('-c, --config [path]', 'Path to config file')
  .option('-o, --output [path]', 'Output file')
  .option('-p, --purge [glob]', 'Purge unused CSS', reduceOption, [])
  .option('-m, --minify', 'Minify the output')
  .action((file, options) => {
    let inputFile = program.args[0]

    if (!inputFile) {
      console.error('No input file given!')
      process.exit(1)
    }

    buildTailwind(inputFile, options, writeStrategy(options)).then(() => {
      process.exit()
    })
  })

program
  .command('*', null, {
    noHelp: true,
  })
  .action(() => {
    program.help()
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
  process.exit()
}
