#!/usr/bin/env node

// import autoprefixer from 'autoprefixer'
import chokidar from 'chokidar'
import postcss from 'postcss'
import chalk from 'chalk'
import path from 'path'
import arg from 'arg'
import fs from 'fs'
import processTailwindFeatures from './jit/processTailwindFeatures'
import resolveConfig from '../resolveConfig'

// ---

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

// ---

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

function getTailwindConfig(configPath = args['--config'] ?? path.resolve('./tailwind.config.js')) {
  return resolveConfig(require(configPath))
}

function buildOnce() {
  let config = getTailwindConfig()

  let tailwindPlugin = (opts = {}) => {
    return {
      postcssPlugin: 'tailwindcss',
      Once(root, { result }) {
        processTailwindFeatures(({ createContext }) => {
          return () => {
            return createContext(config)
          }
        })(root, result)
      },
    }
  }
  tailwindPlugin.postcss = true

  let plugins = [
    // TODO: Bake in postcss-import support?
    // TODO: Bake in postcss-nested support?
    tailwindPlugin,
    // require('autoprefixer'),
    // formatNodes,
  ]

  let processor = postcss(plugins)

  function processCSS(css) {
    return processor.process(css, { from: input, to: output }).then((result) => {
      fs.writeFile(output, result.css, () => true)
      if (result.map) {
        fs.writeFile(output + '.map', result.map.toString(), () => true)
      }
    })
  }

  // TODO: Read from file
  let css = '@tailwind base; @tailwind components; @tailwind utilities'
  return processCSS(css)
}

function startWatcher() {
  function build(config) {
    console.log('Rebuilding...')

    let changedContent = [{ content: 'font-bold', extension: 'html' }]

    let tailwindPlugin = (opts = {}) => {
      return {
        postcssPlugin: 'tailwindcss',
        Once(root, { result }) {
          processTailwindFeatures(({ createContext }) => {
            return () => {
              return createContext(config, changedContent)
            }
          })(root, result)
        },
      }
    }
    tailwindPlugin.postcss = true

    let plugins = [
      // TODO: Bake in postcss-import support?
      // TODO: Bake in postcss-nested support?
      tailwindPlugin,
      // require('autoprefixer'),
      // formatNodes,
    ]

    let processor = postcss(plugins)

    function processCSS(css) {
      return processor.process(css, { from: input, to: output }).then((result) => {
        fs.writeFile(output, result.css, () => true)
        if (result.map) {
          fs.writeFile(output + '.map', result.map.toString(), () => true)
        }
      })
    }

    // TODO: Read from file
    // let css = '@tailwind base; @tailwind components; @tailwind utilities'
    let css = '@tailwind utilities'
    return processCSS(css)
  }
  // Files to watch:
  // - tailwind.config.js
  // - Purge files
  // - Config dependencies
  // - CSS file
  // - CSS imports

  let configPath = args['--config'] ?? path.resolve('./tailwind.config.js')
  let config = getTailwindConfig(configPath)

  let watcher = chokidar.watch([configPath], { ignoreInitial: true })

  watcher.on('change', async (file) => {
    if (file === configPath) {
      console.time('Resolve config')
      delete require.cache[require.resolve(configPath)]
      let config = getTailwindConfig(configPath)
      console.timeEnd('Resolve config')

      console.time('Build')
      await build(config)
      console.timeEnd('Build')
    }
  })

  build(config)
}

if (shouldWatch) {
  startWatcher()
} else {
  buildOnce()
}
