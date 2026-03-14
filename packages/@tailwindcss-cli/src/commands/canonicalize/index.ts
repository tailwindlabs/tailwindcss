import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createInterface } from 'node:readline'
import type { Readable, Writable } from 'node:stream'
import { compare } from '../../../../tailwindcss/src/utils/compare'
import { segment } from '../../../../tailwindcss/src/utils/segment'
import { args, type Arg } from '../../utils/args'
import { help } from '../help'

const css = String.raw
export type OutputFormat = 'text' | 'json' | 'jsonl'

export interface CandidateGroupResult {
  input: string
  output: string
  changed: boolean
}

export interface RunCommandLineOptions {
  argv?: string[]
  cwd?: string
  stdin?: string | null
  stdinIsTTY?: boolean
  stdoutIsTTY?: boolean
}

export interface RunCommandLineResult {
  exitCode: number
  stdout: string
  stderr: string
}

export function usage() {
  return 'tailwindcss canonicalize [classes...]'
}

function usageWithCss() {
  return 'tailwindcss canonicalize --css input.css [classes...]'
}

function usageWithStream() {
  return 'tailwindcss canonicalize --stream [--css input.css]'
}

export function options() {
  return {
    '--css': {
      type: 'string',
      description:
        'CSS entry file used to load the Tailwind design system (defaults to `@import "tailwindcss";`)',
    },
    '--format': {
      type: 'string',
      description: 'Output format',
      default: 'text',
      values: ['text', 'json', 'jsonl'],
    },
    '--stream': {
      type: 'boolean',
      description: 'Read candidate groups from stdin line by line and write results to stdout',
      default: false,
    },
  } satisfies Arg
}

const sharedOptions = {
  '--help': {
    type: 'boolean',
    description: 'Display usage information',
    alias: '-h',
    default: false,
  },
} satisfies Arg

export async function runCommandLine({
  argv = process.argv.slice(2),
  cwd = process.cwd(),
  stdin = null,
  stdinIsTTY = process.stdin.isTTY,
  stdoutIsTTY = process.stdout.isTTY,
}: RunCommandLineOptions = {}): Promise<RunCommandLineResult> {
  try {
    let flags = args(
      {
        ...options(),
        ...sharedOptions,
      },
      argv,
    )

    if ((stdoutIsTTY && argv.length === 0) || flags['--help']) {
      return {
        exitCode: 0,
        stdout: helpMessage(),
        stderr: '',
      }
    }

    if (flags['--stream']) {
      await streamStdin({ css: flags['--css'], cwd, input: process.stdin, output: process.stdout })
      return { exitCode: 0, stdout: '', stderr: '' }
    }

    let format = parseFormat(flags['--format'])
    let inputs = flags._.length > 0 ? flags._ : await readCandidateGroups({ stdin, stdinIsTTY })

    if (inputs.length === 0) {
      return usageError('No candidate groups provided')
    }

    let results = await processCandidateGroups({
      css: flags['--css'],
      cwd,
      inputs,
    })

    return {
      exitCode: 0,
      stdout: formatCandidateResults(results, format),
      stderr: '',
    }
  } catch (error) {
    return {
      exitCode: 1,
      stdout: '',
      stderr: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function streamStdin({
  css: cssFile,
  cwd,
  input,
  output,
}: {
  css: string | null
  cwd: string
  input: Readable
  output: Writable
}): Promise<void> {
  let designSystem = await loadDesignSystem(cssFile, cwd)
  let rl = createInterface({ input })

  for await (let line of rl) {
    output.write(sortAndCanonicalizeCandidates(designSystem, line) + '\n')
  }
}

export function readCandidateGroups({
  stdin,
  stdinIsTTY,
}: {
  stdin: string | null
  stdinIsTTY: boolean
}) {
  if (stdin !== null) {
    return Promise.resolve(splitCandidateGroups(stdin))
  }

  if (stdinIsTTY) {
    return Promise.resolve([])
  }

  return drainStdin().then(splitCandidateGroups)
}

export async function drainStdin() {
  return new Promise<string>((resolve, reject) => {
    let result = ''

    process.stdin.on('data', (chunk) => {
      result += chunk
    })

    process.stdin.on('end', () => resolve(result))
    process.stdin.on('error', (err) => reject(err))
  })
}

export async function processCandidateGroups({
  css,
  cwd = process.cwd(),
  inputs,
}: {
  css: string | null
  cwd?: string
  inputs: string[]
}): Promise<CandidateGroupResult[]> {
  let designSystem = await loadDesignSystem(css, cwd)

  return inputs.map((input) => {
    let output = sortAndCanonicalizeCandidates(designSystem, input)

    return {
      input,
      output,
      changed: output !== input,
    }
  })
}

export function formatCandidateResults(results: CandidateGroupResult[], format: OutputFormat) {
  switch (format) {
    case 'json':
      return JSON.stringify(results, null, 2)
    case 'jsonl':
      return results.map((result) => JSON.stringify(result)).join('\n')
    case 'text':
      return results.map((result) => result.output).join('\n')
  }
}

function helpMessage() {
  return help({
    render: false,
    usage: [usage(), usageWithCss(), usageWithStream()],
    options: {
      ...options(),
      ...sharedOptions,
    },
  })
}

async function loadDesignSystem(cssFile: string | null, cwd: string) {
  if (cssFile === null) {
    return __unstable__loadDesignSystem(
      css`
        @import 'tailwindcss';
      `,
      { base: cwd },
    )
  }

  let resolvedCssFile = path.resolve(cwd, cssFile)
  let content = await fs.readFile(resolvedCssFile, 'utf8')
  return __unstable__loadDesignSystem(content, {
    base: path.dirname(resolvedCssFile),
  })
}

function splitCandidateGroups(input: string) {
  return input
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function parseFormat(input: string): OutputFormat {
  if (input === 'text' || input === 'json' || input === 'jsonl') {
    return input
  }

  throw new Error(`Invalid value for --format: ${input}`)
}

function usageError(message: string): RunCommandLineResult {
  return {
    exitCode: 1,
    stdout: helpMessage(),
    stderr: message,
  }
}

function splitCandidates(input: string) {
  let trimmedInput = input.trim()
  if (trimmedInput.length === 0) return []

  return segment(trimmedInput, ' ')
    .map((candidate) => candidate.trim())
    .filter((candidate) => candidate.length > 0)
}

function sortAndCanonicalizeCandidates(
  designSystem: Awaited<ReturnType<typeof __unstable__loadDesignSystem>>,
  input: string,
) {
  let candidates = splitCandidates(input)
  candidates = designSystem.canonicalizeCandidates(candidates, {
    collapse: true,
    logicalToPhysical: true,
  })
  return defaultSort(designSystem.getClassOrder(candidates))
    .join(' ')
}

function defaultSort(entries: [string, bigint | null][]) {
  return entries
    .slice()
    .sort(([candidateA, orderA], [candidateZ, orderZ]) => {
      if (orderA === orderZ) return compare(candidateA, candidateZ)
      if (orderA === null) return -1
      if (orderZ === null) return 1
      return bigSign(orderA - orderZ) || compare(candidateA, candidateZ)
    })
    .map(([candidate]) => candidate)
}

function bigSign(value: bigint) {
  if (value > 0n) {
    return 1
  } else if (value === 0n) {
    return 0
  } else {
    return -1
  }
}
