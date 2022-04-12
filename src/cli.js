#!/usr/bin/env node

import { postcss, lazyCssnano, lazyAutoprefixer } from '../peers/index.js'

import chokidar from 'chokidar'
import path from 'path'
import arg from 'arg'
import fs from 'fs'
import postcssrc from 'postcss-load-config'
import { lilconfig } from 'lilconfig'
import loadPlugins from 'postcss-load-config/src/plugins' // Little bit scary, looking at private/internal API
import tailwind from './processTailwindFeatures'
import resolveConfigInternal from '../resolveConfig'
import fastGlob from 'fast-glob'
import getModuleDependencies from './lib/getModuleDependencies'
import log from './util/log'
import packageJson from '../package.json'
import normalizePath from 'normalize-path'

let env = {
  DEBUG: process.env.DEBUG !== undefined && process.env.DEBUG !== '0',
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

async function outputFile(file, contents) {
  if (fs.existsSync(file) && (await fs.promises.readFile(file, 'utf8')) === contents) {
    return // Skip writing the file
  }

  // Write the file
  await fs.promises.writeFile(file, contents, 'utf8')
}

function drainStdin() {
  return new Promise((resolve, reject) => {
    let result = ''
    process.stdin.on('data', (chunk) => {
      result += chunk
    })
    process.stdin.on('end', () => resolve(result))
    process.stdin.on('error', (err) => reject(err))
  })
}

function help({ message, usage, commands, options }) {
  let indent = 2

  // Render header
  console.log()
  console.log(`${packageJson.name} v${packageJson.version}`)

  // Render message
  if (message) {
    console.log()
    for (let msg of message.split('\n')) {
      console.log(msg)
    }
  }

  // Render usage
  if (usage && usage.length > 0) {
    console.log()
    console.log('Usage:')
    for (let example of usage) {
      console.log(' '.repeat(indent), example)
    }
  }

  // Render commands
  if (commands && commands.length > 0) {
    console.log()
    console.log('Commands:')
    for (let command of commands) {
      console.log(' '.repeat(indent), command)
    }
  }

  // Render options
  if (options) {
    let groupedOptions = {}
    for (let [key, value] of Object.entries(options)) {
      if (typeof value === 'object') {
        groupedOptions[key] = { ...value, flags: [key] }
      } else {
        groupedOptions[value].flags.push(key)
      }
    }

    console.log()
    console.log('Options:')
    for (let { flags, description, deprecated } of Object.values(groupedOptions)) {
      if (deprecated) continue

      if (flags.length === 1) {
        console.log(
          ' '.repeat(indent + 4 /* 4 = "-i, ".length */),
          flags.slice().reverse().join(', ').padEnd(20, ' '),
          description
        )
      } else {
        console.log(
          ' '.repeat(indent),
          flags.slice().reverse().join(', ').padEnd(24, ' '),
          description
        )
      }
    }
  }

  console.log()
}

function oneOf(...options) {
  return Object.assign(
    (value = true) => {
      for (let option of options) {
        let parsed = option(value)
        if (parsed === value) {
          return parsed
        }
      }

      throw new Error('...')
    },
    { manualParsing: true }
  )
}

let commands = {
  init: {
    run: init,
    args: {
      '--full': { type: Boolean, description: 'Initialize a full `tailwind.config.js` file' },
      '--postcss': { type: Boolean, description: 'Initialize a `postcss.config.js` file' },
      '--types': {
        type: Boolean,
        description: 'Add TypeScript types for the `tailwind.config.js` file',
      },
      '-f': '--full',
      '-p': '--postcss',
    },
  },
  build: {
    run: build,
    args: {
      '--input': { type: String, description: 'Input file' },
      '--output': { type: String, description: 'Output file' },
      '--watch': { type: Boolean, description: 'Watch for changes and rebuild as needed' },
      /*
      '--poll': {
        type: Boolean,
        description: 'Use polling instead of filesystem events when watching',
      },
      */
      '--content': {
        type: String,
        description: 'Content paths to use for removing unused classes',
      },
      '--purge': {
        type: String,
        deprecated: true,
      },
      '--postcss': {
        type: oneOf(String, Boolean),
        description: 'Load custom PostCSS configuration',
      },
      '--minify': { type: Boolean, description: 'Minify the output' },
      '--config': {
        type: String,
        description: 'Path to a custom config file',
      },
      '--no-autoprefixer': {
        type: Boolean,
        description: 'Disable autoprefixer',
      },
      '-c': '--config',
      '-i': '--input',
      '-o': '--output',
      '-m': '--minify',
      '-w': '--watch',
      /*
      '-p': '--poll',
      */
    },
  },
}

let sharedFlags = {
  '--help': { type: Boolean, description: 'Display usage information' },
  '-h': '--help',
}

if (
  process.stdout.isTTY /* Detect redirecting output to a file */ &&
  (process.argv[2] === undefined ||
    process.argv.slice(2).every((flag) => sharedFlags[flag] !== undefined))
) {
  help({
    usage: [
      'tailwindcss [--input input.css] [--output output.css] [--watch] [options...]',
      'tailwindcss init [--full] [--postcss] [--types] [options...]',
    ],
    commands: Object.keys(commands)
      .filter((command) => command !== 'build')
      .map((command) => `${command} [options]`),
    options: { ...commands.build.args, ...sharedFlags },
  })
  process.exit(0)
}

let command = ((arg = '') => (arg.startsWith('-') ? undefined : arg))(process.argv[2]) || 'build'

if (commands[command] === undefined) {
  if (fs.existsSync(path.resolve(command))) {
    // TODO: Deprecate this in future versions
    // Check if non-existing command, might be a file.
    command = 'build'
  } else {
    help({
      message: `Invalid command: ${command}`,
      usage: ['tailwindcss <command> [options]'],
      commands: Object.keys(commands)
        .filter((command) => command !== 'build')
        .map((command) => `${command} [options]`),
      options: sharedFlags,
    })
    process.exit(1)
  }
}

// Execute command
let { args: flags, run } = commands[command]
let args = (() => {
  try {
    let result = arg(
      Object.fromEntries(
        Object.entries({ ...flags, ...sharedFlags })
          .filter(([_key, value]) => !value?.type?.manualParsing)
          .map(([key, value]) => [key, typeof value === 'object' ? value.type : value])
      ),
      { permissive: true }
    )

    // Manual parsing of flags to allow for special flags like oneOf(Boolean, String)
    for (let i = result['_'].length - 1; i >= 0; --i) {
      let flag = result['_'][i]
      if (!flag.startsWith('-')) continue

      let flagName = flag
      let handler = flags[flag]

      // Resolve flagName & handler
      while (typeof handler === 'string') {
        flagName = handler
        handler = flags[handler]
      }

      if (!handler) continue

      let args = []
      let offset = i + 1

      // Parse args for current flag
      while (result['_'][offset] && !result['_'][offset].startsWith('-')) {
        args.push(result['_'][offset++])
      }

      // Cleanup manually parsed flags + args
      result['_'].splice(i, 1 + args.length)

      // Set the resolved value in the `result` object
      result[flagName] = handler.type(
        args.length === 0 ? undefined : args.length === 1 ? args[0] : args,
        flagName
      )
    }

    // Ensure that the `command` is always the first argument in the `args`.
    // This is important so that we don't have to check if a default command
    // (build) was used or not from within each plugin.
    //
    // E.g.: tailwindcss input.css -> _: ['build', 'input.css']
    // E.g.: tailwindcss build input.css -> _: ['build', 'input.css']
    if (result['_'][0] !== command) {
      result['_'].unshift(command)
    }

    return result
  } catch (err) {
    if (err.code === 'ARG_UNKNOWN_OPTION') {
      help({
        message: err.message,
        usage: ['tailwindcss <command> [options]'],
        options: sharedFlags,
      })
      process.exit(1)
    }
    throw err
  }
})()

if (args['--help']) {
  help({
    options: { ...flags, ...sharedFlags },
    usage: [`tailwindcss ${command} [options]`],
  })
  process.exit(0)
}

run()

// ---

function init() {
  let messages = []

  let tailwindConfigLocation = path.resolve(args['_'][1] ?? './tailwind.config.js')
  if (fs.existsSync(tailwindConfigLocation)) {
    messages.push(`${path.basename(tailwindConfigLocation)} already exists.`)
  } else {
    let stubFile = fs.readFileSync(
      args['--full']
        ? path.resolve(__dirname, '../stubs/defaultConfig.stub.js')
        : path.resolve(__dirname, '../stubs/simpleConfig.stub.js'),
      'utf8'
    )

    if (args['--types']) {
      let typesHeading = "/** @type {import('tailwindcss/types').Config} */"
      stubFile =
        stubFile.replace(`module.exports = `, `${typesHeading}\nconst config = `) +
        '\nmodule.exports = config'
    }

    // Change colors import
    stubFile = stubFile.replace('../colors', 'tailwindcss/colors')

    fs.writeFileSync(tailwindConfigLocation, stubFile, 'utf8')

    messages.push(`Created Tailwind CSS config file: ${path.basename(tailwindConfigLocation)}`)
  }

  if (args['--postcss']) {
    let postcssConfigLocation = path.resolve('./postcss.config.js')
    if (fs.existsSync(postcssConfigLocation)) {
      messages.push(`${path.basename(postcssConfigLocation)} already exists.`)
    } else {
      let stubFile = fs.readFileSync(
        path.resolve(__dirname, '../stubs/defaultPostCssConfig.stub.js'),
        'utf8'
      )

      fs.writeFileSync(postcssConfigLocation, stubFile, 'utf8')

      messages.push(`Created PostCSS config file: ${path.basename(postcssConfigLocation)}`)
    }
  }

  if (messages.length > 0) {
    console.log()
    for (let message of messages) {
      console.log(message)
    }
  }
}

async function build() {
  let input = args['--input']
  let output = args['--output']
  let shouldWatch = args['--watch']
  let shouldPoll = false
  /*
  let shouldPoll = args['--poll']
  */
  let shouldCoalesceWriteEvents = shouldPoll || process.platform === 'win32'
  let includePostCss = args['--postcss']

  // Polling interval in milliseconds
  // Used only when polling or coalescing add/change events on Windows
  let pollInterval = 10

  // TODO: Deprecate this in future versions
  if (!input && args['_'][1]) {
    console.error('[deprecation] Running tailwindcss without -i, please provide an input file.')
    input = args['--input'] = args['_'][1]
  }

  if (input && input !== '-' && !fs.existsSync((input = path.resolve(input)))) {
    console.error(`Specified input file ${args['--input']} does not exist.`)
    process.exit(9)
  }

  if (args['--config'] && !fs.existsSync((args['--config'] = path.resolve(args['--config'])))) {
    console.error(`Specified config file ${args['--config']} does not exist.`)
    process.exit(9)
  }

  let configPath = args['--config']
    ? args['--config']
    : ((defaultPath) => (fs.existsSync(defaultPath) ? defaultPath : null))(
        path.resolve('./tailwind.config.js')
      )

  async function loadPostCssPlugins() {
    let customPostCssPath = typeof args['--postcss'] === 'string' ? args['--postcss'] : undefined
    let { plugins: configPlugins } = customPostCssPath
      ? await (async () => {
          let file = path.resolve(customPostCssPath)

          // Implementation, see: https://unpkg.com/browse/postcss-load-config@3.1.0/src/index.js
          let { config = {} } = await lilconfig('postcss').load(file)
          if (typeof config === 'function') {
            config = config()
          } else {
            config = Object.assign({}, config)
          }

          if (!config.plugins) {
            config.plugins = []
          }

          return { plugins: loadPlugins(config, file) }
        })()
      : await postcssrc()

    let configPluginTailwindIdx = configPlugins.findIndex((plugin) => {
      if (typeof plugin === 'function' && plugin.name === 'tailwindcss') {
        return true
      }

      if (typeof plugin === 'object' && plugin !== null && plugin.postcssPlugin === 'tailwindcss') {
        return true
      }

      return false
    })

    let beforePlugins =
      configPluginTailwindIdx === -1 ? [] : configPlugins.slice(0, configPluginTailwindIdx)
    let afterPlugins =
      configPluginTailwindIdx === -1
        ? configPlugins
        : configPlugins.slice(configPluginTailwindIdx + 1)

    return [beforePlugins, afterPlugins]
  }

  function resolveConfig() {
    let config = configPath ? require(configPath) : {}

    if (args['--purge']) {
      log.warn('purge-flag-deprecated', [
        'The `--purge` flag has been deprecated.',
        'Please use `--content` instead.',
      ])
      if (!args['--content']) {
        args['--content'] = args['--purge']
      }
    }

    if (args['--content']) {
      let files = args['--content'].split(/(?<!{[^}]+),/)
      let resolvedConfig = resolveConfigInternal(config, { content: { files } })
      resolvedConfig.content.files = files
      return resolvedConfig
    }

    return resolveConfigInternal(config)
  }

  function extractFileGlobs(config) {
    return config.content.files
      .filter((file) => {
        // Strings in this case are files / globs. If it is something else,
        // like an object it's probably a raw content object. But this object
        // is not watchable, so let's remove it.
        return typeof file === 'string'
      })
      .map((glob) => normalizePath(glob))
  }

  function extractRawContent(config) {
    return config.content.files.filter((file) => {
      return typeof file === 'object' && file !== null
    })
  }

  function getChangedContent(config) {
    let changedContent = []

    // Resolve globs from the content config
    let globs = extractFileGlobs(config)
    let files = fastGlob.sync(globs)

    for (let file of files) {
      changedContent.push({
        content: fs.readFileSync(path.resolve(file), 'utf8'),
        extension: path.extname(file).slice(1),
      })
    }

    // Resolve raw content in the tailwind config
    for (let { raw: content, extension = 'html' } of extractRawContent(config)) {
      changedContent.push({ content, extension })
    }

    return changedContent
  }

  async function buildOnce() {
    let config = resolveConfig()
    let changedContent = getChangedContent(config)

    let tailwindPlugin = () => {
      return {
        postcssPlugin: 'tailwindcss',
        Once(root, { result }) {
          tailwind(({ createContext }) => {
            return () => {
              return createContext(config, changedContent)
            }
          })(root, result)
        },
      }
    }

    tailwindPlugin.postcss = true

    let [beforePlugins, afterPlugins] = includePostCss ? await loadPostCssPlugins() : [[], []]

    let plugins = [
      ...beforePlugins,
      tailwindPlugin,
      !args['--minify'] && formatNodes,
      ...afterPlugins,
      !args['--no-autoprefixer'] &&
        (() => {
          // Try to load a local `autoprefixer` version first
          try {
            return require('autoprefixer')
          } catch {}

          return lazyAutoprefixer()
        })(),
      args['--minify'] &&
        (() => {
          let options = { preset: ['default', { cssDeclarationSorter: false }] }

          // Try to load a local `cssnano` version first
          try {
            return require('cssnano')
          } catch {}

          return lazyCssnano()(options)
        })(),
    ].filter(Boolean)

    let processor = postcss(plugins)

    function processCSS(css) {
      let start = process.hrtime.bigint()
      return Promise.resolve()
        .then(() => (output ? fs.promises.mkdir(path.dirname(output), { recursive: true }) : null))
        .then(() => processor.process(css, { from: input, to: output }))
        .then((result) => {
          if (!output) {
            return process.stdout.write(result.css)
          }

          return Promise.all(
            [
              outputFile(output, result.css),
              result.map && outputFile(output + '.map', result.map.toString()),
            ].filter(Boolean)
          )
        })
        .then(() => {
          let end = process.hrtime.bigint()
          console.error()
          console.error('Done in', (end - start) / BigInt(1e6) + 'ms.')
        })
    }

    let css = await (() => {
      // Piping in data, let's drain the stdin
      if (input === '-') {
        return drainStdin()
      }

      // Input file has been provided
      if (input) {
        return fs.readFileSync(path.resolve(input), 'utf8')
      }

      // No input file provided, fallback to default atrules
      return '@tailwind base; @tailwind components; @tailwind utilities'
    })()

    return processCSS(css)
  }

  let context = null

  async function startWatcher() {
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

    let [beforePlugins, afterPlugins] = includePostCss ? await loadPostCssPlugins() : [[], []]

    let plugins = [
      ...beforePlugins,
      '__TAILWIND_PLUGIN_POSITION__',
      !args['--minify'] && formatNodes,
      ...afterPlugins,
      !args['--no-autoprefixer'] &&
        (() => {
          // Try to load a local `autoprefixer` version first
          try {
            return require('autoprefixer')
          } catch {}

          return lazyAutoprefixer()
        })(),
      args['--minify'] &&
        (() => {
          let options = { preset: ['default', { cssDeclarationSorter: false }] }

          // Try to load a local `cssnano` version first
          try {
            return require('cssnano')
          } catch {}

          return lazyCssnano()(options)
        })(),
    ].filter(Boolean)

    async function rebuild(config) {
      env.DEBUG && console.time('Finished in')

      let tailwindPlugin = () => {
        return {
          postcssPlugin: 'tailwindcss',
          Once(root, { result }) {
            env.DEBUG && console.time('Compiling CSS')
            tailwind(({ createContext }) => {
              console.error()
              console.error('Rebuilding...')

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

      tailwindPlugin.postcss = true

      let tailwindPluginIdx = plugins.indexOf('__TAILWIND_PLUGIN_POSITION__')
      let copy = plugins.slice()
      copy.splice(tailwindPluginIdx, 1, tailwindPlugin)
      let processor = postcss(copy)

      function processCSS(css) {
        let start = process.hrtime.bigint()
        return Promise.resolve()
          .then(() =>
            output ? fs.promises.mkdir(path.dirname(output), { recursive: true }) : null
          )
          .then(() => processor.process(css, { from: input, to: output }))
          .then(async (result) => {
            for (let message of result.messages) {
              if (message.type === 'dependency') {
                contextDependencies.add(message.file)
              }
            }
            watcher.add([...contextDependencies])

            if (!output) {
              return process.stdout.write(result.css)
            }

            return Promise.all(
              [
                outputFile(output, result.css),
                result.map && outputFile(output + '.map', result.map.toString()),
              ].filter(Boolean)
            )
          })
          .then(() => {
            let end = process.hrtime.bigint()
            console.error('Done in', (end - start) / BigInt(1e6) + 'ms.')
          })
          .catch((err) => {
            if (err.name === 'CssSyntaxError') {
              console.error(err.toString())
            } else {
              console.error(err)
            }
          })
      }

      let css = await (() => {
        // Piping in data, let's drain the stdin
        if (input === '-') {
          return drainStdin()
        }

        // Input file has been provided
        if (input) {
          return fs.readFileSync(path.resolve(input), 'utf8')
        }

        // No input file provided, fallback to default atrules
        return '@tailwind base; @tailwind components; @tailwind utilities'
      })()

      let result = await processCSS(css)
      env.DEBUG && console.timeEnd('Finished in')
      return result
    }

    let config = refreshConfig(configPath)

    if (input) {
      contextDependencies.add(path.resolve(input))
    }

    watcher = chokidar.watch([...contextDependencies, ...extractFileGlobs(config)], {
      usePolling: shouldPoll,
      interval: shouldPoll ? pollInterval : undefined,
      ignoreInitial: true,
      awaitWriteFinish: shouldCoalesceWriteEvents
        ? {
            stabilityThreshold: 50,
            pollInterval: pollInterval,
          }
        : false,
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
            content: fs.readFileSync(path.resolve(file), 'utf8'),
            extension: path.extname(file).slice(1),
          })

          await rebuild(config)
        })
      }
    })

    watcher.on('add', async (file) => {
      chain = chain.then(async () => {
        changedContent.push({
          content: fs.readFileSync(path.resolve(file), 'utf8'),
          extension: path.extname(file).slice(1),
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
    /* Abort the watcher if stdin is closed to avoid zombie processes */
    process.stdin.on('end', () => process.exit(0))
    process.stdin.resume()
    startWatcher()
  } else {
    buildOnce()
  }
}
