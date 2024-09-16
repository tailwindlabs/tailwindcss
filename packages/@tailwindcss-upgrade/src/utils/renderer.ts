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
export function wordWrap(text: string, width: number) {
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
