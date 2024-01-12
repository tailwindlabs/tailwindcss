// @ts-check

import fs from 'fs'
import path from 'path'
import isGlob from 'is-glob'
import fastGlob from 'fast-glob'
import { parseGlob } from '../util/parseGlob'
import { env } from './sharedState'
import { resolveContentPaths } from '@tailwindcss/oxide'

/*!
 * Modified version of normalize-path, original license below
 *
 * normalize-path <https://github.com/jonschlinkert/normalize-path>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */

function normalizePath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('expected path to be a string')
  }

  if (path === '\\' || path === '/') return '/'

  var len = path.length
  if (len <= 1) return path

  // ensure that win32 namespaces has two leading slashes, so that the path is
  // handled properly by the win32 version of path.parse() after being normalized
  // https://msdn.microsoft.com/library/windows/desktop/aa365247(v=vs.85).aspx#namespaces
  var prefix = ''
  if (len > 4 && path[3] === '\\') {
    var ch = path[2]
    if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
      path = path.slice(2)
      prefix = '//'
    }
  }

  // Modified part:

  // Assumption: `\\\\[` or `\\\\(` means that the first `\\` is the path separator, and the second
  // `\\` is the escape for the special `[]` and `()` characters and therefore we want to rewrite
  // it as `/` and then the escape `\\` which will result in `/\\`.
  path = path.replace(/\\\\([\[\]\(\)])/g, '/\\$1')

  // Instead of purely splitting on `\\` and `/`, we split on
  // `/` and `\\` that is _not_ followed by any of the following characters: ()[]
  // This is to ensure that we keep the escaping of brackets and parentheses
  let segs = path.split(/[/\\]+(?![\(\)\[\]])/)

  return prefix + segs.join('/')
}

/** @typedef {import('../../types/config.js').RawFile} RawFile */
/** @typedef {import('../../types/config.js').FilePath} FilePath */

/*
 * @param {import('tailwindcss').Config} tailwindConfig
 * @param {{skip:string[]}} options
 * @returns {ContentPath[]}
 */
function resolveContentFiles(tailwindConfig, { skip = [] } = {}) {
  if (
    Array.isArray(tailwindConfig.content.files) &&
    tailwindConfig.content.files.includes('auto')
  ) {
    let idx = tailwindConfig.content.files.indexOf('auto')
    if (idx !== -1) {
      env.DEBUG && console.time('Calculating resolve content paths')
      let resolved = resolveContentPaths({ base: process.cwd() })
      env.DEBUG && console.timeEnd('Calculating resolve content paths')

      tailwindConfig.content.files.splice(idx, 1, ...resolved)
    }
  }

  if (skip.length > 0) {
    tailwindConfig.content.files = tailwindConfig.content.files.filter(
      (filePath) => !skip.includes(filePath)
    )
  }

  return tailwindConfig.content.files
}

/**
 * @typedef {object} ContentPath
 * @property {string} original
 * @property {string} base
 * @property {string | null} glob
 * @property {boolean} ignore
 * @property {string} pattern
 */

/**
 * Turn a list of content paths (absolute or not; glob or not) into a list of
 * absolute file paths that exist on the filesystem
 *
 * If there are symlinks in the path then multiple paths will be returned
 * one for the symlink and one for the actual file
 *
 * @param {*} context
 * @param {import('tailwindcss').Config} tailwindConfig
 * @returns {ContentPath[]}
 */
export function parseCandidateFiles(context, tailwindConfig) {
  let files = resolveContentFiles(tailwindConfig, {
    skip: [context.userConfigPath],
  })

  console.log({ files })

  // Normalize the file globs
  files = files.filter((filePath) => typeof filePath === 'string')

  // Split into included and excluded globs
  let tasks = fastGlob.generateTasks(files)

  /** @type {ContentPath[]} */
  let included = []

  /** @type {ContentPath[]} */
  let excluded = []

  for (const task of tasks) {
    included.push(...task.positive.map((filePath) => parseFilePath(filePath, false)))
    excluded.push(...task.negative.map((filePath) => parseFilePath(filePath, true)))
  }

  let paths = [...included, ...excluded]

  console.log('parseCandidateFiles 0', { paths })

  // Resolve paths relative to the config file or cwd
  paths = resolveRelativePaths(context, paths)

  console.log('parseCandidateFiles 1', { paths })

  // Resolve symlinks if possible
  paths = paths.flatMap(resolvePathSymlinks)

  console.log('parseCandidateFiles 2', { paths })

  // Update cached patterns
  paths = paths.map(resolveGlobPattern)

  console.log('parseCandidateFiles 3', { paths })

  return paths
}

/**
 *
 * @param {string} filePath
 * @param {boolean} ignore
 * @returns {ContentPath}
 */
function parseFilePath(filePath, ignore) {
  // Escape special characters in the file path such as: ()[]
  // But only if the special character isn't already escaped (and balanced)
  filePath = filePath
    .replace(/(\\)?\[(.*?)\]/g, (match, prefix, contents) => {
      return match.startsWith('\\[') && match.endsWith('\\]')
        ? match
        : `${prefix || ''}\\[${contents}\\]`
    })
    .replace(/(\\)?\((.*?)\)/g, (match, prefix, contents) => {
      return match.startsWith('\\(') && match.endsWith('\\)')
        ? match
        : `${prefix || ''}\\(${contents}\\)`
    })

  // Normalize the file path for Windows
  filePath = normalizePath(filePath)

  let contentPath = {
    original: filePath,
    base: filePath,
    ignore,
    pattern: filePath,
    glob: null,
  }

  if (isGlob(filePath)) {
    Object.assign(contentPath, parseGlob(filePath))
  }

  return contentPath
}

/**
 *
 * @param {ContentPath} contentPath
 * @returns {ContentPath}
 */
function resolveGlobPattern(contentPath) {
  contentPath.pattern = contentPath.glob
    ? `${contentPath.base}/${contentPath.glob}`
    : contentPath.base

  contentPath.pattern = contentPath.ignore ? `!${contentPath.pattern}` : contentPath.pattern

  return contentPath
}

/**
 * Resolve each path relative to the config file (when possible) if the experimental flag is enabled
 * Otherwise, resolve relative to the current working directory
 *
 * @param {any} context
 * @param {ContentPath[]} contentPaths
 * @returns {ContentPath[]}
 */
function resolveRelativePaths(context, contentPaths) {
  let resolveFrom = []

  // Resolve base paths relative to the config file (when possible) if the experimental flag is enabled
  if (context.userConfigPath && context.tailwindConfig.content.relative) {
    resolveFrom = [path.posix.dirname(context.userConfigPath)]
  }

  return contentPaths.map((contentPath) => {
    contentPath.base = path.posix.resolve(...resolveFrom, contentPath.base)

    if (
      path.sep === '\\' &&
      contentPath.base.startsWith('/') &&
      !contentPath.base.startsWith('//?/')
    ) {
      contentPath.base = `C:${contentPath.base}`
    }

    return contentPath
  })
}

/**
 * Resolve the symlink for the base directory / file in each path
 * These are added as additional dependencies to watch for changes because
 * some tools (like webpack) will only watch the actual file or directory
 * but not the symlink itself even in projects that use monorepos.
 *
 * @param {ContentPath} contentPath
 * @returns {ContentPath[]}
 */
function resolvePathSymlinks(contentPath) {
  let paths = [contentPath]

  try {
    let resolvedPath = normalizePath(fs.realpathSync(contentPath.base))
    if (resolvedPath !== contentPath.base) {
      paths.push({
        ...contentPath,
        base: resolvedPath,
      })
    }
  } catch {
    // TODO: log this?
  }

  return paths
}

/**
 * @param {any} context
 * @param {ContentPath[]} candidateFiles
 * @param {Map<string, number>} fileModifiedMap
 * @returns {[{ content: string, extension: string }[], Map<string, number>]}
 */
export function resolvedChangedContent(context, candidateFiles, fileModifiedMap) {
  let changedContent = context.tailwindConfig.content.files
    .filter((item) => typeof item.raw === 'string')
    .map(({ raw, extension = 'html' }) => ({ content: raw, extension }))

  let [changedFiles, mTimesToCommit] = resolveChangedFiles(candidateFiles, fileModifiedMap)

  for (let changedFile of changedFiles) {
    let extension = path.extname(changedFile).slice(1)
    changedContent.push({ file: changedFile, extension })
  }

  return [changedContent, mTimesToCommit]
}

/**
 *
 * @param {ContentPath[]} candidateFiles
 * @param {Map<string, number>} fileModifiedMap
 * @returns {[Set<string>, Map<string, number>]}
 */
function resolveChangedFiles(candidateFiles, fileModifiedMap) {
  let paths = candidateFiles.map((contentPath) => contentPath.pattern)
  let mTimesToCommit = new Map()

  let changedFiles = new Set()
  env.DEBUG && console.time('Finding changed files')
  let files = fastGlob.sync(paths, { absolute: true })

  console.log({ paths, files })

  for (let file of files) {
    let prevModified = fileModifiedMap.get(file) || -Infinity
    let modified = fs.statSync(file).mtimeMs

    if (modified > prevModified) {
      changedFiles.add(file)
      mTimesToCommit.set(file, modified)
    }
  }
  env.DEBUG && console.timeEnd('Finding changed files')
  return [changedFiles, mTimesToCommit]
}
