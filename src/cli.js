#!/usr/bin/env node

let autoprefixer = require('autoprefixer')
let tailwindcss = require('./index')
let chokidar = require('chokidar')
let postcss = require('postcss')
let chalk = require('chalk')
let path = require('path')
let arg = require('arg')
let fs = require('fs')

/*
  Overall CLI architecture:

  - Resolve config in CLI, not within Tailwind
  - Track config as a dependency (+ the config's own dependencies) in the CLI
    - Don't bother crawling config dependencies in one-off build mode
  - Track all `purge` files as dependencies
  - Somehow bypass all internal chokidar stuff in the JIT engine itself
  - Send some sort of external hash/key into Tailwind to help it identify the context without doing anything
    - `contextKey` ?

*/

let args = arg({
  '--files': String,
  '--config': String,
  '--output': String,
  '--minify': Boolean,
  '--watch': Boolean,
  '-f': '--files',
  '-c': '--config',
  '-o': '--output',
  '-m': '--minify',
  '-w': '--watch',
})

let input = args['_'][1]
let output = args['--output']
let files = args['--files']
let shouldWatch = args['--watch']
let shouldMinify = args['--minify']

if (!output) {
  throw new Error('Missing required output file: --output, -o, or first argument')
}

if (files.length === 0) {
  throw new Error('Must provide at least one purge file or directory: --files, -f')
}

if (shouldWatch) {
  process.env.TAILWIND_MODE = 'watch'
}

let processors = [tailwindcss({ config: getConfig() }), autoprefixer]

if (process.env.NODE_ENV === 'production' || shouldMinify) {
  process.env.NODE_ENV = 'production'

  processors.push(require('cssnano'))
}

let css = input
  ? fs.readFileSync(input)
  : '@tailwind base; @tailwind components; @tailwind utilities'

if (shouldWatch) {
  chokidar.watch(files, { ignored: /[\/\\]\./ }).on('all', () => {
    processCSS()
  })
} else {
  processCSS()
}

function processCSS() {
  console.log(chalk.cyan('♻️ tailbuilding...'))

  mkdirp.sync(path.dirname(output))

  postcss(processors)
    .process(css, { from: input, to: output })
    .then((result) => {
      fs.writeFile(output, result.css, () => true)

      if (result.map) {
        fs.writeFile(output + '.map', result.map.toString(), () => true)
      }
    })
}

function getConfig() {
  if (args['--config']) return args['--config']

  if (fs.existsSync('tailwind.config.js')) return 'tailwind.config.js'

  return {
    mode: 'jit',
    purge: files,
  }
}
