// @ts-check

const path = require('path')
const { expect } = require('@jest/globals')
const child = require('child_process')
const fs = require('fs')
const { promisify } = require('util')
const glob = require('fast-glob')
const { URL } = require('url')
const exec = promisify(child.exec)
const writeFile = promisify(fs.writeFile)
const deleteFile = promisify(fs.unlink)
const http = require('http')
const { ProxyServer } = require('./ProxyServer.js')

/**
 * @typedef {'webpack-v5' | 'parcel-v2' } IntegrationTestedTool
 */

/**
 * @typedef {Record<string, Record<string, string | number | (string | number)[]>>} Theme
 * @typedef {Record<string, string[]>} Variants
 *
 * @typedef {object} TailwindConfig
 * @property {'jit' | 'aot'} [mode]
 * @property {string|((selectorOrPrefix: string) => string)} [prefix]
 * @property {boolean|string} [important]
 * @property {string} [separator]
 * @property {any[]} [presets]
 * @property {false|string[]} [purge]
 * @property {false|'class'|'media'} [darkMode]
 * @property {Theme & {extend?: Theme}} [theme]
 * @property {Variants & {extend?: Variants}} [variants]
 * @property {Record<string, boolean>} [corePlugins]
 * @property {any[]} [plugins]
 */

/**
 * @typedef {object} ToolPrep
 * @property {TailwindConfig} [config]
 * @property {{path: string, contents: string}[]} [files]
 * @property {string[]} [failures]
 * @property {import('./ProxyServer.js').ProxyConfigItem[]} [proxy]
 */

/** @type {import('./Tool.js').Tool[]} */
const all = []

const defaultProxy = [
  { path: '/src', target: './src' },
  { path: '/dist', target: './dist' },
]

module.exports.Tool = class Tool {
  /**
   *
   * @param {IntegrationTestedTool} name
   * @param {ToolPrep} [prep]
   */
  constructor(name, prep = {}) {
    this.name = name
    this.dir = path.resolve(__dirname, `./${name}`)
    this.prep = prep
    this.prep.failures = this.prep.failures || []
    this.prep.proxy = this.prep.proxy || defaultProxy

    this.lastUsedConfig = prep.config

    /** @type {child.ChildProcess[]} */
    this.processes = []

    this.proxy = new ProxyServer(this.dir)

    all.push(this)
  }

  async start() {
    await this.proxy.start()
    this.proxy.reconfigure(defaultProxy)
  }

  /**
   *
   */
  async cleanSlate() {
    // Delete the tailwind.config.js, everything under ./src, everything under ./dist
    await this.deleteFiles([
      { path: './tailwind.config.js' },
      { path: './src/**/*' },
      { path: './dist/**/*' },
      { path: './extra/**/*' },
    ])

    await this.writeFiles([
      ...this.prep.files,

      {
        path: './tailwind.config.js',
        contents: `module.exports = ${JSON.stringify(this.prep.config)}`,
      },
    ])
  }

  async waitForFilesToChange(timeout = 2500) {
    // TODO: Can we actually wait for the files to change
    await this.delay(timeout)
  }

  /**
   *
   * @param {TailwindConfig | ((config: TailwindConfig) => TailwindConfig | void)} config
   */
  async updateConfig(config) {
    if (typeof config === 'function') {
      const passedConfig = { ...this.lastUsedConfig }

      config = config(passedConfig) || passedConfig
    }

    this.lastUsedConfig = config

    await this.writeFiles([
      {
        path: './tailwind.config.js',
        contents: `module.exports = ${JSON.stringify(config)}`,
      },
    ])
  }

  /**
   *
   * @param {{path: string}[]} files
   * @returns {Promise<(string|Error|null)[]>}
   */
  async readFiles(files) {
    return await Promise.all(
      files.map(async (file) => {
        return await this.readFile(file.path)
      })
    )
  }

  /**
   *
   * @param {string} file
   * @returns {Promise<(string|Error|null)>}
   */
   async readFile(file) {
    try {
      return await request(new URL(file, this.proxy.address))
    } catch (err) {
      return err.message
    }
  }

  /**
   *
   * @param {{path: string}[]} files
   */
  async deleteFiles(files) {
    // Find all matching files
    const paths = await Promise.all(
      files.map((file) => glob(path.resolve(this.dir, `./${file.path}`)))
    )

    /** @type {string[]} */
    // @ts-ignore
    const filePaths = paths.flatMap((paths) => paths)

    // Delete them all matching files
    return await Promise.all(filePaths.map((path) => deleteFile(path)))
  }

  /**
   *
   * @param {{path: string, contents: string}[]} files
   */
  async writeFiles(files) {
    return await Promise.all(
      files.map((file) => writeFile(path.resolve(this.dir, `./${file.path}`), file.contents))
    )
  }

  /**
   *
   * @param {string} script
   * @param {Record<string, string>} [env]
   */
  run(script, env = {}) {
    const promise = exec(`npm run ${script}`, {
      cwd: this.dir,
      env: {
        ...process.env,
        ...env,
      },
    })

    this.processes.push(promise.child)

    promise.catch(() => {
      // prevent unhandled rejection failure exceptions
    })

    return promise
  }

  async build() {
    return await this.run('build', {
      TAILWIND_MODE: 'build',
      NODE_ENV: 'development',
    })
  }

  /** @param {number} duration */
  async delay(duration) {
    await new Promise((resolve) => setTimeout(resolve, duration))
  }

  async watch() {
    this.proxy.reconfigure(this.prep.proxy)

    const p = this.run('watch', {
      TAILWIND_MODE: 'watch',
      NODE_ENV: 'development',
    })

    // TODO: Detect that the tool's watcher AND tailwind's watcher have
    // both properly started instead of a hardcoded timer
    await this.delay(2000)

    return {
      stop: async () => {
        await this.proxy.stop()
        await waitForExit(p.child, () => p.child.kill())
      },
    }
  }

  async cleanup() {
    await this.proxy.stop()

    await Promise.all(this.processes.map((process) => waitForExit(process, () => process.kill())))
  }

  // Expectation Helpers

  /**
   *
   * @param {string} name
   * @param {{path: string, expected: string}[]} files
   */
  async expectCss(name, files) {

    // TODO: Move into proxy?
    await this.waitForFilesToChange()

    const results = await this.readFiles(files)

    for (const [index, file] of Object.entries(files)) {
      let expectation = expect(results[index])

      if (this.prep.failures.includes(name)) {
        expectation = expectation.not
      }

      // @ts-ignore
      expectation.toMatchFormattedCss(file.expected)
    }
  }
}

module.exports.cleanupAllTools = async function cleanupAllTools() {
  await Promise.all(all.map((tool) => tool.cleanup()))
}

/**
 *
 * @param {child.ChildProcess} process
 * @param {() => any|Promise<any>} callback
 */
async function waitForExit(process, callback) {
  if (process.exitCode !== null || process.signalCode !== null) {
    return Promise.resolve({ code: process.exitCode, signal: process.signalCode })
  }

  const p = new Promise((resolve) =>
    process.on('exit', (code, signal) => resolve({ code, signal }))
  )

  await callback()
  await p
}

/**
 *
 * @param {import('url').URL} url
 * @returns {Promise<string>}
 */
 async function request(url) {
  return new Promise((resolve, reject) => {
    http.get(url, { headers: { accept: 'text/css,*/*;q=0.1' }}, response => {
      let data = ''

      response.on('data', _data => (data += _data))
      response.on('end', () => resolve(data))
      response.on('error', err => reject(err))
    })
  })
}
