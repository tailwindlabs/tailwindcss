// @ts-check

import chokidar from 'chokidar'
import crypto from 'crypto'
import fs from 'fs'
import os from 'os'
import path from 'path'
import log from '../../util/log'
import { env } from './sharedState'

// Earmarks a directory for our touch files.
// If the directory already exists we delete any existing touch files,
// invalidating any caches associated with them.
let touchDir =
  env.TAILWIND_TOUCH_DIR || path.join(os.homedir() || os.tmpdir(), '.tailwindcss', 'touch')

if (!env.TAILWIND_DISABLE_TOUCH) {
  if (fs.existsSync(touchDir)) {
    for (let file of fs.readdirSync(touchDir)) {
      try {
        fs.unlinkSync(path.join(touchDir, file))
      } catch (_err) {}
    }
  } else {
    fs.mkdirSync(touchDir, { recursive: true })
  }
}

// This is used to trigger rebuilds. Just updating the timestamp
// is significantly faster than actually writing to the file (10x).

function touch(filename) {
  let time = new Date()

  try {
    fs.utimesSync(filename, time, time)
  } catch (err) {
    fs.closeSync(fs.openSync(filename, 'w'))
  }
}

export function rebootWatcher(context) {
  if (context.touchFile === null) {
    context.touchFile = generateTouchFileName()
    touch(context.touchFile)
  }

  if (env.TAILWIND_MODE === 'build') {
    return
  }

  if (
    env.TAILWIND_MODE === 'watch' ||
    (env.TAILWIND_MODE === undefined && env.NODE_ENV === 'development')
  ) {
    Promise.resolve(context.watcher ? context.watcher.close() : null).then(() => {
      log.info([
        'Tailwind CSS is watching for changes...',
        'https://tailwindcss.com/docs/just-in-time-mode#watch-mode-and-one-off-builds',
      ])

      context.watcher = chokidar.watch([...context.candidateFiles, ...context.configDependencies], {
        ignoreInitial: true,
      })

      context.watcher.on('add', (file) => {
        let changedFile = path.resolve('.', file)
        let content = fs.readFileSync(changedFile, 'utf8')
        let extension = path.extname(changedFile).slice(1)
        context.changedContent.push({ content, extension })
        touch(context.touchFile)
      })

      context.watcher.on('change', (file) => {
        // If it was a config dependency, touch the config file to trigger a new context.
        // This is not really that clean of a solution but it's the fastest, because we
        // can do a very quick check on each build to see if the config has changed instead
        // of having to get all of the module dependencies and check every timestamp each
        // time.
        if (context.configDependencies.has(file)) {
          for (let dependency of context.configDependencies) {
            delete require.cache[require.resolve(dependency)]
          }
          touch(context.configPath)
        } else {
          let changedFile = path.resolve('.', file)
          let content = fs.readFileSync(changedFile, 'utf8')
          let extension = path.extname(changedFile).slice(1)
          context.changedContent.push({ content, extension })
          touch(context.touchFile)
        }
      })

      context.watcher.on('unlink', (file) => {
        // Touch the config file if any of the dependencies are deleted.
        if (context.configDependencies.has(file)) {
          for (let dependency of context.configDependencies) {
            delete require.cache[require.resolve(dependency)]
          }
          touch(context.configPath)
        }
      })
    })
  }
}

function generateTouchFileName() {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let randomChars = ''
  let randomCharsLength = 12
  let bytes = null

  try {
    bytes = crypto.randomBytes(randomCharsLength)
  } catch (_error) {
    bytes = crypto.pseudoRandomBytes(randomCharsLength)
  }

  for (let i = 0; i < randomCharsLength; i++) {
    randomChars += chars[bytes[i] % chars.length]
  }

  return path.join(touchDir, `touch-${process.pid}-${randomChars}`)
}
