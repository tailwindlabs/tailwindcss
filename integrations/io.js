let { rm, existsSync } = require('fs')
let path = require('path')
let fs = require('fs/promises')

let chokidar = require('chokidar')

let resolveToolRoot = require('./resolve-tool-root')

function getWatcherOptions() {
  return {
    usePolling: true,
    interval: 200,
    awaitWriteFinish: {
      stabilityThreshold: 1500,
      pollInterval: 50,
    },
  }
}

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
      Object.entries(fileCache).map(async ([file, content]) => {
        try {
          if (content === null) {
            return await fs.unlink(file)
          } else {
            return await fs.writeFile(file, content, 'utf8')
          }
        } catch {}
      })
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
    cleanupFile(file) {
      let filePath = path.resolve(toolRoot, file)
      fileCache[filePath] = null
    },
    async fileExists(file) {
      let filePath = path.resolve(toolRoot, file)
      return existsSync(filePath)
    },
    async removeFile(file) {
      let filePath = path.resolve(toolRoot, file)
      if (!fileCache[filePath]) {
        fileCache[filePath] = await fs.readFile(filePath, 'utf8')
      }
      await fs.unlink(filePath)
    },
    async readOutputFile(file) {
      file = await resolveFile(file, absoluteOutputFolder)
      return fs.readFile(path.resolve(absoluteOutputFolder, file), 'utf8')
    },
    async readInputFile(file) {
      file = await resolveFile(file, absoluteInputFolder)
      return fs.readFile(path.resolve(absoluteInputFolder, file), 'utf8')
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
        try {
          fileCache[filePath] = await fs.readFile(filePath, 'utf8')
        } catch (err) {
          if (err.code === 'ENOENT') {
            fileCache[filePath] = null // Sentinel value to `delete` the file afterwards. This also means that we are writing to a `new` file inside the test.
          } else {
            throw err
          }
        }
      }

      return fs.writeFile(path.resolve(absoluteInputFolder, file), contents, 'utf8')
    },
    async waitForOutputFileCreation(file) {
      if (file instanceof RegExp) {
        let r = file
        let watcher = chokidar.watch(absoluteOutputFolder, getWatcherOptions())

        return new Promise((resolve) => {
          watcher.on('add', (file) => {
            if (r.test(file)) {
              watcher.close().then(() => resolve())
            }
          })
        })
      } else {
        let filePath = path.resolve(absoluteOutputFolder, file)

        return new Promise((resolve) => {
          let watcher = chokidar.watch(absoluteOutputFolder, getWatcherOptions())

          watcher.on('add', (addedFile) => {
            if (addedFile !== filePath) return
            return watcher.close().finally(resolve)
          })
        })
      }
    },
    async waitForOutputFileChange(file, cb = () => {}) {
      file = await resolveFile(file, absoluteOutputFolder)
      let filePath = path.resolve(absoluteOutputFolder, file)

      return new Promise((resolve) => {
        let watcher = chokidar.watch(absoluteOutputFolder, getWatcherOptions())

        watcher
          .on('change', (changedFile) => {
            if (changedFile !== filePath) return
            return watcher.close().finally(resolve)
          })
          .on('ready', cb)
      })
    },
  }
}
