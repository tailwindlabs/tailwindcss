import fs from 'node:fs'
import path from 'node:path'
import { stripVTControlCharacters } from 'node:util'
import pc from 'picocolors'
import { resolve } from '../utils/resolve'
import { formatNanoseconds } from './format-ns'

export const UI = {
  indent: 2,
}
export function header() {
  return `${pc.italic(pc.bold(pc.blue('\u2248')))} tailwindcss ${pc.blue(`v${getVersion()}`)}`
}

export function highlight(file: string) {
  return `${pc.dim(pc.blue('`'))}${pc.blue(file)}${pc.dim(pc.blue('`'))}`
}

/**
 * Convert an `absolute` path to a `relative` path from the current working
 * directory.
 */
export function relative(
  to: string,
  from = process.cwd(),
  { preferAbsoluteIfShorter = true } = {},
) {
  let result = path.relative(from, to)
  if (!result.startsWith('..')) {
    result = `.${path.sep}${result}`
  }

  if (preferAbsoluteIfShorter && result.length > to.length) {
    return to
  }

  return result
}

/**
 * Wrap `text` into multiple lines based on the `width`.
 */
export function wordWrap(text: string, width: number): string[] {
  // Handle text with newlines by maintaining the newlines, then splitting
  // each line separately.
  if (text.includes('\n')) {
    return text.split('\n').flatMap((line) => (line ? wordWrap(line, width) : ['']))
  }

  let words = text.split(' ')
  let lines = []

  let line = ''
  let lineLength = 0
  for (let word of words) {
    let wordLength = stripVTControlCharacters(word).length

    if (lineLength + wordLength + 1 > width) {
      lines.push(line)
      line = ''
      lineLength = 0
    }

    line += (lineLength ? ' ' : '') + word
    lineLength += wordLength + (lineLength ? 1 : 0)
  }

  if (lineLength) {
    lines.push(line)
  }

  return lines
}

/**
 * Format a duration in nanoseconds to a more human readable format.
 */
export function formatDuration(ns: bigint) {
  let formatted = formatNanoseconds(ns)

  if (ns <= 50 * 1e6) return pc.green(formatted)
  if (ns <= 300 * 1e6) return pc.blue(formatted)
  if (ns <= 1000 * 1e6) return pc.yellow(formatted)

  return pc.red(formatted)
}

export function indent(value: string, offset = 0) {
  return `${' '.repeat(offset + UI.indent)}${value}`
}

function log(message: string, { art = pc.gray('\u2502'), prefix = '', print = eprintln }) {
  let prefixLength = prefix.length
  let padding = ' '
  let paddingLength = padding.length
  let artLength = stripVTControlCharacters(art).length
  let availableWidth = process.stderr.columns
  let totalWidth = availableWidth - prefixLength - paddingLength * 2 - artLength

  wordWrap(message, totalWidth).map((line, idx) => {
    return print(
      `${art}${padding}${idx === 0 ? prefix : ' '.repeat(prefixLength)}${line}${padding}`,
    )
  })
  print()
}

export function success(message: string, { prefix = '', print = eprintln } = {}) {
  log(message, { art: pc.green('\u2502'), prefix, print })
}

export function info(message: string, { prefix = '', print = eprintln } = {}) {
  log(message, { art: pc.blue('\u2502'), prefix, print })
}

export function error(message: string, { prefix = '', print = eprintln } = {}) {
  log(message, { art: pc.red('\u2502'), prefix, print })
}

export function warn(message: string, { prefix = '', print = eprintln } = {}) {
  log(message, { art: pc.yellow('\u2502'), prefix, print })
}

// Rust inspired functions to print to the console:

export function eprintln(value = '') {
  process.stderr.write(`${value}\n`)
}

export function println(value = '') {
  process.stdout.write(`${value}\n`)
}

function getVersion(): string {
  if (typeof globalThis.__tw_version === 'string') {
    return globalThis.__tw_version
  }
  let { version } = JSON.parse(fs.readFileSync(resolve('tailwindcss/package.json'), 'utf-8'))
  return version
}
