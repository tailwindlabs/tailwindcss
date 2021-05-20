let { rm, existsSync } = require('fs')
let path = require('path')
let fs = require('fs/promises')

let chokidar = require('chokidar')

let resolveToolRoot = require('./resolve-tool-root')

module.exports = function ({
  /** Output directory, relative to the tool. */
  output = 'dist',

  /** Input directory, relative to the tool. */
  input = 'src',

  /** Whether or not you want to cleanup the output directory. */
  cleanup = true,
} = {}) {
  let toolRoot = resolveToolRoot()
  let fileCache = {}

  let absoluteOutputFolder = path.resolve(toolRoot, output)
  let absoluteInputFolder = path.resolve(toolRoot, input)

  if (cleanup) {
    beforeAll((done) => rm(absoluteOutputFolder, { recursive: true, force: true }, done))
    afterEach((done) => rm(absoluteOutputFolder, { recursive: true, force: true }, done))
  }

  // Restore all written files
  afterEach(async () => {
    await Promise.all(
      Object.entries(fileCache).map(([file, content]) => fs.writeFile(file, content, 'utf8'))
    )
  })

  async function readdir(start, parent = []) {
    let files = await fs.readdir(start, { withFileTypes: true })
    let resolvedFiles = await Promise.all(
      files.map((file) => {
        if (file.isDirectory()) {
          return readdir(path.resolve(start, file.name), [...parent, file.name])
        }
        return parent.concat(file.name).join(path.sep)
      })
    )
    return resolvedFiles.flat(Infinity)
  }

  async function resolveFile(fileOrRegex, directory) {
    if (fileOrRegex instanceof RegExp) {
      let files = await readdir(directory)
      if (files.length === 0) {
        throw new Error(`No files exists in "${directory}"`)
      }

      let filtered = files.filter((file) => fileOrRegex.test(file))
      if (filtered.length === 0) {
        throw new Error(`Not a single file matched: ${fileOrRegex}`)
      } else if (filtered.length > 1) {
        throw new Error(`Multiple files matched: ${fileOrRegex}`)
      }

      return filtered[0]
    }

    return fileOrRegex
  }

  return {
    async readOutputFile(file) {
      file = await resolveFile(file, absoluteOutputFolder)
      return fs.readFile(path.resolve(absoluteOutputFolder, file), 'utf8')
    },
    async appendToInputFile(file, contents) {
      let filePath = path.resolve(absoluteInputFolder, file)
      if (!fileCache[filePath]) {
        fileCache[filePath] = await fs.readFile(filePath, 'utf8')
      }

      return fs.appendFile(filePath, contents, 'utf8')
    },
    async writeInputFile(file, contents) {
      let filePath = path.resolve(absoluteInputFolder, file)
      if (!fileCache[filePath]) {
        fileCache[filePath] = await fs.readFile(filePath, 'utf8')
      }

      return fs.writeFile(path.resolve(absoluteInputFolder, file), contents, 'utf8')
    },
    async waitForOutputFileCreation(file) {
      if (file instanceof RegExp) {
        let r = file
        let watcher = chokidar.watch(absoluteOutputFolder)

        return new Promise((resolve) => {
          watcher.on('add', (file) => {
            if (r.test(file)) {
              watcher.close()
              resolve()
            }
          })
        })
      } else {
        let filePath = path.resolve(absoluteOutputFolder, file)
        let watcher = chokidar.watch(filePath)

        let watcherPromise = new Promise((resolve) => {
          watcher.once('add', () => {
            watcher.close()
            resolve()
          })
        })

        if (existsSync(filePath)) {
          watcher.close()
          return Promise.resolve()
        }

        return watcherPromise
      }
    },
    async waitForOutputFileChange(file, cb = () => {}) {
      file = await resolveFile(file, absoluteOutputFolder)

      let filePath = path.resolve(absoluteOutputFolder, file)
      let watcher = chokidar.watch(filePath)

      return new Promise((resolve) => {
        let chain = Promise.resolve()
        watcher.once('change', () => {
          watcher.close()
          chain.then(() => resolve())
        })
        chain.then(() => cb())
      })
    },
  }
}
