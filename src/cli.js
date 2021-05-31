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
import fastGlob from 'fast-glob'
import getModuleDependencies from './lib/getModuleDependencies'

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
  TODOs:
  - Reduce getModuleDependencies calls (make configDeps global?)
  - Detect new files
  - Support raw content in purge config
  - Scaffold tailwind.config.js file (with postcss.config.js)
  - Support passing globs from command line
  - Prebundle peer-dependencies
  - Make minification work

  Future:
  - Detect project type, add sensible purge defaults
*/

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

function extractFileGlobs(config) {
  return (Array.isArray(config.purge) ? config.purge : config.purge.content).filter((file) => {
    // Strings in this case are files / globs. If it is something else,
    // like an object it's probably a raw content object. But this object
    // is not watchable, so let's remove it.
    return typeof file === 'string'
  })
}

function buildOnce() {
  let config = resolveConfig(require(args['--config'] ?? path.resolve('./tailwind.config.js')))

  let globs = extractFileGlobs(config)
  let changedContent = []
  let files = fastGlob.sync(globs)
  for (let file of files) {
    changedContent.push({
      content: fs.readFileSync(path.resolve(process.cwd(), file), 'utf8'),
      extension: path.extname(file),
    })
  }

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
    formatNodes,
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

  let css = input
    ? fs.readFileSync(path.resolve(process.cwd(), input), 'utf8')
    : '@tailwind base; @tailwind components; @tailwind utilities'
  return processCSS(css)
}

let context = null

function startWatcher() {
  let changedContent = []
  let configDependencies = []
  let contextDependencies = new Set()
  let watcher = null

  function getTailwindConfig(
    configPath = args['--config'] ?? path.resolve('./tailwind.config.js')
  ) {
    console.time('Module dependencies')
    for (let file of configDependencies) {
      delete require.cache[require.resolve(file)]
    }

    configDependencies = getModuleDependencies(configPath).map(({ file }) => file)
    console.timeEnd('Module dependencies')

    return resolveConfig(require(configPath))
  }

  function build(config) {
    console.log('\n\nRebuilding...')

    let tailwindPlugin = (opts = {}) => {
      return {
        postcssPlugin: 'tailwindcss',
        Once(root, { result }) {
          console.time('Compiling CSS')
          processTailwindFeatures(({ createContext }) => {
            return () => {
              if (context !== null) {
                context.changedContent = changedContent.splice(0)
                return context
              }

              console.time('Creating context')
              context = createContext(config, changedContent.splice(0))
              console.timeEnd('Creating context')
              return context
            }
          })(root, result)
          console.timeEnd('Compiling CSS')
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
        for (let message of result.messages) {
          if (message.type === 'dependency') {
            contextDependencies.add(message.file)
          }
        }
        watcher.add([...contextDependencies])

        fs.writeFile(output, result.css, () => true)
        if (result.map) {
          fs.writeFile(output + '.map', result.map.toString(), () => true)
        }
      })
    }

    let css = input
      ? fs.readFileSync(path.resolve(process.cwd(), input), 'utf8')
      : '@tailwind base; @tailwind components; @tailwind utilities'
    return processCSS(css)
  }

  // TODO: Track config dependencies (getModuleDependencies)
  let configPath = args['--config'] ?? path.resolve('./tailwind.config.js')
  let config = getTailwindConfig(configPath)
  for (let dependency of configDependencies) {
    contextDependencies.add(dependency)
  }
  if (input) {
    contextDependencies.add(path.resolve(process.cwd(), input))
  }

  watcher = chokidar.watch([...contextDependencies, ...extractFileGlobs(config)], {
    ignoreInitial: true,
  })

  let chain = Promise.resolve()

  watcher.on('change', async (file) => {
    if (contextDependencies.has(file)) {
      console.time('Resolve config')
      context = null
      config = getTailwindConfig(configPath)
      console.log(configDependencies)
      for (let dependency of configDependencies) {
        contextDependencies.add(dependency)
      }
      console.timeEnd('Resolve config')

      console.time('Watch new files')
      let globs = extractFileGlobs(config)
      watcher.add(configDependencies)
      watcher.add(globs)
      console.timeEnd('Watch new files')

      chain = chain.then(async () => {
        let files = fastGlob.sync(globs)
        for (let file of files) {
          changedContent.push({
            content: fs.readFileSync(path.resolve(process.cwd(), file), 'utf8'),
            extension: path.extname(file),
          })
        }
        console.time('Build total')
        await build(config)
        console.timeEnd('Build total')
      })
    } else {
      chain = chain.then(async () => {
        changedContent.push({
          content: fs.readFileSync(path.resolve(process.cwd(), file), 'utf8'),
          extension: path.extname(file),
        })

        console.time('Build total')
        await build(config)
        console.timeEnd('Build total')
      })
    }
  })

  chain = chain.then(() => {
    let globs = extractFileGlobs(config)
    let files = fastGlob.sync(globs)
    for (let file of files) {
      changedContent.push({
        content: fs.readFileSync(path.resolve(process.cwd(), file), 'utf8'),
        extension: path.extname(file),
      })
    }
    return build(config)
  })
}

if (shouldWatch) {
  startWatcher()
} else {
  buildOnce()
}
