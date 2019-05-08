import fs from 'fs'
import path from 'path'

import rimraf from 'rimraf'

export default function(callback) {
  return new Promise(resolve => {
    const timestamp = new Date().valueOf()
    const tmpPath = path.resolve(__dirname, `../__tmp_${timestamp}`)
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
