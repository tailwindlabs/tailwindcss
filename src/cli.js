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

/*
  TODOs:

  - Make watching work
  - Compile from custom source CSS file
  - Make minification work
  - Scaffold tailwind.config.js file (with postcss.config.js)

  Future:
  - Detect project type, add sensible purge defaults

*/

// npx tailwindcss -i in.css -o out.css -w --files="./**/*.{js,html}"

let args = arg({
  '--files': String,
  '--config': String,
  '--input': String,
  '--output': String,
  '--minify': Boolean,
  '--watch': Boolean,
  '-f': '--files',
  '-c': '--config',
  '-i': '--input',
  '-o': '--output',
  '-m': '--minify',
  '-w': '--watch',
})

let input = args['--input']
let output = args['--output']
let files = args['--files']
let shouldWatch = args['--watch']
let shouldMinify = args['--minify']

if (!output) {
  throw new Error('Missing required output file: --output, -o, or first argument')
}

function indentRecursive(node, indent = 0) {
  node.each &&
    node.each((child, i) => {
      if (!child.raws.before || !child.raws.before.trim() || child.raws.before.includes('\n')) {
        child.raws.before = `\n${node.type !== 'rule' && i > 0 ? '\n' : ''}${'  '.repeat(indent)}`
      }
      child.raws.after = `\n${'  '.repeat(indent)}`
      indentRecursive(child, indent + 1)
    })
}

function formatNodes(root) {
  indentRecursive(root)
  if (root.first) {
    root.first.raws.before = ''
  }
}

let configPath = args['--config'] ?? path.resolve('./tailwind.config.js')
let config = require(configPath)

let plugins = [
  // TODO: Bake in postcss-import support?
  // TODO: Bake in postcss-nested support?
  {
    postcssPlugin: 'tailwindcss',
    plugins: require('./jit').default(config),
  },
  require('autoprefixer'),
  formatNodes,
]

// TODO: Read from file
let css = '@tailwind base; @tailwind components; @tailwind utilities'
let processor = postcss(plugins)

function processCSS(css) {
  processor.process(css, { from: input, to: output }).then((result) => {
    fs.writeFile(output, result.css, () => true)

    if (result.map) {
      fs.writeFile(output + '.map', result.map.toString(), () => true)
    }
  })
}

if (shouldWatch) {
} else {
  processCSS(css)
}
