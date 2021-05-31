#!/usr/bin/env node

// import autoprefixer from 'autoprefixer'
import chokidar from 'chokidar'
import postcss from 'postcss'
import chalk from 'chalk'
import path from 'path'
import arg from 'arg'
import fs from 'fs'
import tailwindJit from './jit/processTailwindFeatures'
import tailwindAot from './processTailwindFeatures'
import resolveConfigInternal from '../resolveConfig'
import fastGlob from 'fast-glob'
import getModuleDependencies from './lib/getModuleDependencies'

let env = {
  DEBUG: process.env.DEBUG !== undefined,
}

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
  - [x] Reduce getModuleDependencies calls (make configDeps global?)
  - [x] Detect new files
  - [x] Support raw content in purge config
  - [x] Scaffold tailwind.config.js file (with postcss.config.js)
  - [x] Support passing globs from command line
  - [x] Make config file optional
  - [ ] Support AOT mode
  - [ ] Prebundle peer-dependencies
  - [ ] Make minification work
  - [ ] --help option
  - [ ] conditional flags based on arguments
          init -f, --full
          build -f, --files
  - [ ] --jit

  Future:
  - Detect project type, add sensible purge defaults
*/

let args = arg({
  '--jit': Boolean,
  '--files': String,
  '--config': String,
  '--input': String,
  '--output': String,
  '--minify': Boolean,
  '--watch': Boolean,
  '--postcss': Boolean,
  '--full': Boolean,
  '-p': '--postcss',
  '-f': '--files',
  '-c': '--config',
  '-i': '--input',
  '-o': '--output',
  '-m': '--minify',
  '-w': '--watch',
})

let input = args['--input']
let output = args['--output']
let shouldWatch = args['--watch']
let shouldMinify = args['--minify']

if (args['_'].includes('init')) {
  init()
} else {
  build()
}

function init() {
  let tailwindConfigLocation = path.resolve(process.cwd(), 'tailwind.config.js')
  if (fs.existsSync(tailwindConfigLocation)) {
    console.log('tailwind.config.js already exists.')
  } else {
    let stubFile = fs.readFileSync(
      args['--full']
        ? path.resolve(__dirname, '../stubs/defaultConfig.stub.js')
        : path.resolve(__dirname, '../stubs/simpleConfig.stub.js'),
      'utf8'
    )

    // Change colors import
    stubFile = stubFile.replace('../colors', 'tailwindcss/colors')

    // --jit mode
    if (args['--jit']) {
      // Add jit mode
      stubFile = stubFile.replace('module.exports = {', "module.exports = {\n  mode: 'jit',")

      // Deleting variants
      stubFile = stubFile.replace(/variants: {(.*)},\n  /gs, '')
    }

    fs.writeFileSync(tailwindConfigLocation, stubFile, 'utf8')

    console.log('Created Tailwind config file:', 'tailwind.config.js')
  }

  if (args['--postcss']) {
    let postcssConfigLocation = path.resolve(process.cwd(), 'postcss.config.js')
    if (fs.existsSync(postcssConfigLocation)) {
      console.log('postcss.config.js already exists.')
    } else {
      let stubFile = fs.readFileSync(
        path.resolve(__dirname, '../stubs/defaultPostCssConfig.stub.js'),
        'utf8'
      )

      fs.writeFileSync(postcssConfigLocation, stubFile, 'utf8')

      console.log('Created PostCSS config file:', 'tailwind.config.js')
    }
  }
}

function build() {
  if (args['--config'] && !fs.existsSync(args['--config'])) {
    console.error(`Specified config file ${args['--config']} does not exist.`)
    process.exit(9)
  }

  let configPath =
    args['--config'] ??
    ((defaultPath) => (fs.existsSync(defaultPath) ? defaultPath : null))(
      path.resolve('./tailwind.config.js')
    )

  function resolveConfig() {
    let config = require(configPath)
    let resolvedConfig = resolveConfigInternal(config)

    if (args['--files']) {
      resolvedConfig.purge = args['--files'].split(',')
    }

    if (args['--jit']) {
      resolvedConfig.mode = 'jit'
    }

    return resolvedConfig
  }

  if (!output) {
    throw new Error('Missing required output file: --output, -o, or first argument')
  }

  function extractContent(config) {
    return Array.isArray(config.purge) ? config.purge : config.purge.content
  }

  function extractFileGlobs(config) {
    return extractContent(config).filter((file) => {
      // Strings in this case are files / globs. If it is something else,
      // like an object it's probably a raw content object. But this object
      // is not watchable, so let's remove it.
      return typeof file === 'string'
    })
  }

  function extractRawContent(config) {
    return extractContent(config).filter((file) => {
      return typeof file === 'object' && file !== null
    })
  }

  function getChangedContent(config) {
    let changedContent = []

    // Resolve globs from the purge config
    let globs = extractFileGlobs(config)
    let files = fastGlob.sync(globs)

    for (let file of files) {
      changedContent.push({
        content: fs.readFileSync(path.resolve(process.cwd(), file), 'utf8'),
        extension: path.extname(file),
      })
    }

    // Resolve raw content in the tailwind config
    for (let { raw: content, extension = 'html' } of extractRawContent(config)) {
      changedContent.push({ content, extension })
    }

    return changedContent
  }

  function buildOnce() {
    let config = resolveConfig()
    let changedContent = getChangedContent(config)

    let tailwindPlugin =
      config.mode === 'jit'
        ? (opts = {}) => {
            return {
              postcssPlugin: 'tailwindcss',
              Once(root, { result }) {
                tailwindJit(({ createContext }) => {
                  return () => {
                    return createContext(config, changedContent)
                  }
                })(root, result)
              },
            }
          }
        : (opts = {}) => {
            return {
              postcssPlugin: 'tailwindcss',
              plugins: [tailwindAot(() => config, configPath)],
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

    function refreshConfig() {
      env.DEBUG && console.time('Module dependencies')
      for (let file of configDependencies) {
        delete require.cache[require.resolve(file)]
      }

      if (configPath) {
        configDependencies = getModuleDependencies(configPath).map(({ file }) => file)

        for (let dependency of configDependencies) {
          contextDependencies.add(dependency)
        }
      }
      env.DEBUG && console.timeEnd('Module dependencies')

      return resolveConfig()
    }

    async function rebuild(config) {
      console.log('\nRebuilding...')
      env.DEBUG && console.time('Finished in')

      let tailwindPlugin =
        config.mode === 'jit'
          ? (opts = {}) => {
              return {
                postcssPlugin: 'tailwindcss',
                Once(root, { result }) {
                  env.DEBUG && console.time('Compiling CSS')
                  tailwindJit(({ createContext }) => {
                    return () => {
                      if (context !== null) {
                        context.changedContent = changedContent.splice(0)
                        return context
                      }

                      env.DEBUG && console.time('Creating context')
                      context = createContext(config, changedContent.splice(0))
                      env.DEBUG && console.timeEnd('Creating context')
                      return context
                    }
                  })(root, result)
                  env.DEBUG && console.timeEnd('Compiling CSS')
                },
              }
            }
          : (opts = {}) => {
              return {
                postcssPlugin: 'tailwindcss',
                plugins: [tailwindAot(() => config, configPath)],
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
      let result = await processCSS(css)
      env.DEBUG && console.timeEnd('Finished in')
      return result
    }

    let configPath = args['--config'] ?? path.resolve('./tailwind.config.js')
    let config = refreshConfig(configPath)

    if (input) {
      contextDependencies.add(path.resolve(process.cwd(), input))
    }

    watcher = chokidar.watch([...contextDependencies, ...extractFileGlobs(config)], {
      ignoreInitial: true,
    })

    let chain = Promise.resolve()

    watcher.on('change', async (file) => {
      if (contextDependencies.has(file)) {
        env.DEBUG && console.time('Resolve config')
        context = null
        config = refreshConfig(configPath)
        env.DEBUG && console.timeEnd('Resolve config')

        env.DEBUG && console.time('Watch new files')
        let globs = extractFileGlobs(config)
        watcher.add(configDependencies)
        watcher.add(globs)
        env.DEBUG && console.timeEnd('Watch new files')

        chain = chain.then(async () => {
          changedContent.push(...getChangedContent(config))
          await rebuild(config)
        })
      } else {
        chain = chain.then(async () => {
          changedContent.push({
            content: fs.readFileSync(path.resolve(process.cwd(), file), 'utf8'),
            extension: path.extname(file),
          })

          await rebuild(config)
        })
      }
    })

    watcher.on('add', async (file) => {
      chain = chain.then(async () => {
        changedContent.push({
          content: fs.readFileSync(path.resolve(process.cwd(), file), 'utf8'),
          extension: path.extname(file),
        })

        await rebuild(config)
      })
    })

    chain = chain.then(() => {
      changedContent.push(...getChangedContent(config))
      return rebuild(config)
    })
  }

  if (shouldWatch) {
    startWatcher()
  } else {
    buildOnce()
  }
}
