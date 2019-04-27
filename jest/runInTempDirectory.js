import fs from 'fs'
import path from 'path'

import rimraf from 'rimraf'

const tmpPath = path.resolve(__dirname, '../__tmp')

export default function(callback) {
  return new Promise(resolve => {
    const currentPath = process.cwd()

    rimraf.sync(tmpPath)
    fs.mkdirSync(tmpPath)
    process.chdir(tmpPath)

    callback().then(() => {
      process.chdir(currentPath)
      rimraf(tmpPath, resolve)
    })
  })
}
