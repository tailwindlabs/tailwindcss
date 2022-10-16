// @ts-check

import fs from 'fs'
import path from 'path'
import isGlob from 'is-glob'
import fastGlob from 'fast-glob'
import normalizePath from 'normalize-path'
import { parseGlob } from '../util/parseGlob'
import { env } from './sharedState'

/** @typedef {import('../../types/config.js').RawFile} RawFile */
/** @typedef {import('../../types/config.js').FilePath} FilePath */

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
  let files = tailwindConfig.content.files

  // Normalize the file globs
  files = files.filter((filePath) => typeof filePath === 'string')
  files = files.map(normalizePath)

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

  // Resolve paths relative to the config file or cwd
  paths = resolveRelativePaths(context, paths)

  // Resolve symlinks if possible
  paths = paths.flatMap(resolvePathSymlinks)

  // Update cached patterns
  paths = paths.map(resolveGlobPattern)

  return paths
}

/**
 *
 * @param {string} filePath
 * @param {boolean} ignore
 * @returns {ContentPath}
 */
function parseFilePath(filePath, ignore) {
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

  // This is required for Windows support to properly pick up Glob paths.
  // Afaik, this technically shouldn't be needed but there's probably
  // some internal, direct path matching with a normalized path in
  // a package which can't handle mixed directory separators
  contentPath.pattern = normalizePath(contentPath.pattern)

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
    resolveFrom = [path.dirname(context.userConfigPath)]
  }

  return contentPaths.map((contentPath) => {
    contentPath.base = path.resolve(...resolveFrom, contentPath.base)

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
    let resolvedPath = fs.realpathSync(contentPath.base)
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
 * @returns {{ content: string, extension: string }[]}
 */
export function resolvedChangedContent(context, candidateFiles, fileModifiedMap) {
  let changedContent = context.tailwindConfig.content.files
    .filter((item) => typeof item.raw === 'string')
    .map(({ raw, extension = 'html' }) => ({ content: raw, extension }))

  for (let changedFile of resolveChangedFiles(candidateFiles, fileModifiedMap)) {
    let content = fs.readFileSync(changedFile, 'utf8')
    let extension = path.extname(changedFile).slice(1)
    changedContent.push({ content, extension })
  }

  return changedContent
}

/**
 *
 * @param {ContentPath[]} candidateFiles
 * @param {Map<string, number>} fileModifiedMap
 * @returns {Set<string>}
 */
function resolveChangedFiles(candidateFiles, fileModifiedMap) {
  let paths = candidateFiles.map((contentPath) => contentPath.pattern)

  let changedFiles = new Set()
  env.DEBUG && console.time('Finding changed files')
  let files = fastGlob.sync(paths, { absolute: true })
  for (let file of files) {
    let prevModified = fileModifiedMap.has(file) ? fileModifiedMap.get(file) : -Infinity
    let modified = fs.statSync(file).mtimeMs

    if (modified > prevModified) {
      changedFiles.add(file)
      fileModifiedMap.set(file, modified)
    }
  }
  env.DEBUG && console.timeEnd('Finding changed files')
  return changedFiles
}
