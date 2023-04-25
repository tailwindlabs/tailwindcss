import fs from 'fs/promises'
import path from 'path'
import { rimraf } from 'rimraf'

let id = 0

/**
 * @template T
 * @param {() => Promise<T>} callback
 * @returns {Promise<T>}
 */
export default async function (callback) {
  const workerId = `${process.env.JEST_WORKER_ID}-${id++}`
  const tmpPath = path.resolve(__dirname, `../__tmp_${workerId}`)
  const currentPath = process.cwd()

  await rimraf(tmpPath)
  await fs.mkdir(tmpPath)

  process.chdir(tmpPath)
  let result = await callback()
  process.chdir(currentPath)

  await rimraf(tmpPath)
  return result
}
