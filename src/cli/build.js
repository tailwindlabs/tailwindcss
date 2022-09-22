// @ts-check

import fs from 'fs'
import path from 'path'
import postcssrc from 'postcss-load-config'
import { lilconfig } from 'lilconfig'
import loadPlugins from 'postcss-load-config/src/plugins' // Little bit scary, looking at private/internal API
import loadOptions from 'postcss-load-config/src/options' // Little bit scary, looking at private/internal API
import { loadAutoprefixer, loadCssNano, loadPostcss, loadPostcssImport } from './deps'
import log from '../util/log'
import chokidar from 'chokidar'
import fastGlob from 'fast-glob'
import micromatch from 'micromatch'
import normalizePath from 'normalize-path'
import tailwind from '../processTailwindFeatures'
import resolveConfigInternal from '../../resolveConfig'
import getModuleDependencies from '../lib/getModuleDependencies'
import { validateConfig } from '../util/validateConfig.js'
import { parseCandidateFiles } from '../lib/content.js'

let env = {
  DEBUG: process.env.DEBUG !== undefined && process.env.DEBUG !== '0',
}

export async function build(args, configs) {
  let input = args['--input']
  let output = args['--output']
  let shouldWatch = args['--watch']
  let shouldPoll = args['--poll']
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

  // TODO: Reference the @config path here if exists
  let configPath = args['--config']
    ? args['--config']
    : ((defaultPath) => (fs.existsSync(defaultPath) ? defaultPath : null))(
        path.resolve(`./${configs.tailwind}`)
      )

  async function loadPostCssPlugins() {
    let customPostCssPath = typeof args['--postcss'] === 'string' ? args['--postcss'] : undefined
    let config = customPostCssPath
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

          return {
            file,
            plugins: loadPlugins(config, file),
            options: loadOptions(config, file),
          }
        })()
      : await postcssrc()

    let configPlugins = config.plugins

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

    return [beforePlugins, afterPlugins, config.options]
  }

  function loadBuiltinPostcssPlugins() {
    let postcss = loadPostcss()
    let IMPORT_COMMENT = '__TAILWIND_RESTORE_IMPORT__: '
    return [
      [
        (root) => {
          root.walkAtRules('import', (rule) => {
            if (rule.params.slice(1).startsWith('tailwindcss/')) {
              rule.after(postcss.comment({ text: IMPORT_COMMENT + rule.params }))
              rule.remove()
            }
          })
        },
        loadPostcssImport(),
        (root) => {
          root.walkComments((rule) => {
            if (rule.text.startsWith(IMPORT_COMMENT)) {
              rule.after(
                postcss.atRule({
                  name: 'import',
                  params: rule.text.replace(IMPORT_COMMENT, ''),
                })
              )
              rule.remove()
            }
          })
        },
      ],
      [],
      {},
    ]
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
      resolvedConfig = validateConfig(resolvedConfig)
      return resolvedConfig
    }

    let resolvedConfig = resolveConfigInternal(config)
    resolvedConfig = validateConfig(resolvedConfig)
    return resolvedConfig
  }

  function extractFileGlobs(config) {
    let context = {
      tailwindConfig: config,
      userConfigPath: configPath,
    }

    let contentPaths = parseCandidateFiles(context, config)

    return contentPaths.map((contentPath) => contentPath.pattern)
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

    let [beforePlugins, afterPlugins, postcssOptions] = includePostCss
      ? await loadPostCssPlugins()
      : loadBuiltinPostcssPlugins()

    let plugins = [
      ...beforePlugins,
      tailwindPlugin,
      !args['--minify'] && formatNodes,
      ...afterPlugins,
      !args['--no-autoprefixer'] && loadAutoprefixer(),
      args['--minify'] && loadCssNano(),
    ].filter(Boolean)

    let postcss = loadPostcss()
    let processor = postcss(plugins)

    function processCSS(css) {
      let start = process.hrtime.bigint()
      return Promise.resolve()
        .then(() => (output ? fs.promises.mkdir(path.dirname(output), { recursive: true }) : null))
        .then(() => processor.process(css, { ...postcssOptions, from: input, to: output }))
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

    let [beforePlugins, afterPlugins] = includePostCss
      ? await loadPostCssPlugins()
      : loadBuiltinPostcssPlugins()

    let plugins = [
      ...beforePlugins,
      '__TAILWIND_PLUGIN_POSITION__',
      !args['--minify'] && formatNodes,
      ...afterPlugins,
      !args['--no-autoprefixer'] && loadAutoprefixer(),
      args['--minify'] && loadCssNano(),
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
      let postcss = loadPostcss()
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

    let config = refreshConfig()
    let contentPatterns = refreshContentPatterns(config)

    /**
     * @param {import('../../types/config.js').RequiredConfig} config
     * @return {{all: string[], dynamic: string[]}}
     **/
    function refreshContentPatterns(config) {
      // TODO: This can be optimized since we're using `fastGlob.generateTasks` indirectly in extractFileGlobs
      let globs = extractFileGlobs(config)
      let tasks = fastGlob.generateTasks(globs, { absolute: true })
      let dynamicPatterns = tasks.filter((task) => task.dynamic).flatMap((task) => task.patterns)
      let staticPatterns = tasks.filter((task) => !task.dynamic).flatMap((task) => task.patterns)

      return {
        all: [...staticPatterns, ...dynamicPatterns],
        dynamic: dynamicPatterns,
      }
    }

    if (input) {
      contextDependencies.add(path.resolve(input))
    }

    watcher = chokidar.watch([...contextDependencies, ...extractFileGlobs(config)], {
      // Force checking for atomic writes in all situations
      // This causes chokidar to wait up to 100ms for a file to re-added after it's been unlinked
      // This only works when watching directories though
      atomic: true,

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
    let pendingRebuilds = new Set()

    watcher.on('change', async (file) => {
      if (contextDependencies.has(file)) {
        env.DEBUG && console.time('Resolve config')
        context = null
        config = refreshConfig()
        contentPatterns = refreshContentPatterns(config)
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

    /**
     * When rapidly saving files atomically a couple of situations can happen:
     * - The file is missing since the external program has deleted it by the time we've gotten around to reading it from the earlier save.
     * - The file is being written to by the external program by the time we're going to read it and is thus treated as busy because a lock is held.
     *
     * To work around this we retry reading the file a handful of times with a delay between each attempt
     *
     * @param {string} path
     * @param {number} tries
     * @returns {Promise<string | undefined>}
     * @throws {Error} If the file is still missing or busy after the specified number of tries
     */
    async function readFileWithRetries(path, tries = 5) {
      for (let n = 0; n <= tries; n++) {
        try {
          return await fs.promises.readFile(path, 'utf8')
        } catch (err) {
          if (n !== tries) {
            if (err.code === 'ENOENT' || err.code === 'EBUSY') {
              await new Promise((resolve) => setTimeout(resolve, 10))

              continue
            }
          }

          throw err
        }
      }
    }

    // Restore watching any files that are "removed"
    // This can happen when a file is pseudo-atomically replaced (a copy is created, overwritten, the old one is unlinked, and the new one is renamed)
    // TODO: An an optimization we should allow removal when the config changes
    watcher.on('unlink', (file) => {
      file = normalizePath(file)

      // Only re-add the file if it's not covered by a dynamic pattern
      if (!micromatch.some([file], contentPatterns.dynamic)) {
        watcher.add(file)
      }
    })

    // Some applications such as Visual Studio (but not VS Code)
    // will only fire a rename event for atomic writes and not a change event
    // This is very likely a chokidar bug but it's one we need to work around
    // We treat this as a change event and rebuild the CSS
    watcher.on('raw', (evt, filePath, meta) => {
      if (evt !== 'rename') {
        return
      }

      let watchedPath = meta.watchedPath

      // Watched path might be the file itself
      // Or the directory it is in
      filePath = watchedPath.endsWith(filePath) ? watchedPath : path.join(watchedPath, filePath)

      // Skip this event since the files it is for does not match any of the registered content globs
      if (!micromatch.some([filePath], contentPatterns.all)) {
        return
      }

      // Skip since we've already queued a rebuild for this file that hasn't happened yet
      if (pendingRebuilds.has(filePath)) {
        return
      }

      pendingRebuilds.add(filePath)

      chain = chain.then(async () => {
        let content

        try {
          content = await readFileWithRetries(path.resolve(filePath))
        } finally {
          pendingRebuilds.delete(filePath)
        }

        changedContent.push({
          content,
          extension: path.extname(filePath).slice(1),
        })

        await rebuild(config)
      })
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
