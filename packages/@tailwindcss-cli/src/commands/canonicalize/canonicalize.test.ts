import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import { runCommandLine } from '.'
import { normalizeWindowsSeparators } from '../../utils/test-helpers'

let css = normalizeWindowsSeparators(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/input.css'),
)

describe('runCommandLine', { timeout: 30_000 }, () => {
  test('canonicalizes, collapses, and sorts candidate groups from positional arguments', async () => {
    let result = await runCommandLine({
      argv: ['--css', css, 'py-3 p-1 px-3'],
      stdinIsTTY: true,
      stdoutIsTTY: false,
    })

    expect(result).toEqual({
      exitCode: 0,
      stdout: 'p-3',
      stderr: '',
    })
  })

  test('falls back to the default tailwind import when --css is omitted', async () => {
    let result = await runCommandLine({
      argv: ['py-3 p-1 px-3'],
      cwd: path.dirname(css),
      stdinIsTTY: true,
      stdoutIsTTY: false,
    })

    expect(result).toEqual({
      exitCode: 0,
      stdout: 'p-3',
      stderr: '',
    })
  })

  test('canonicalizes, collapses, and sorts multiple groups from stdin lines', async () => {
    let result = await runCommandLine({
      argv: ['--css', css],
      stdin: '[display:_flex_] py-3 p-1 px-3\nmt-2 mr-2 mb-2 ml-2 focus:hover:p-3 hover:p-1 py-3\n',
      stdinIsTTY: false,
      stdoutIsTTY: false,
    })

    expect(result).toEqual({
      exitCode: 0,
      stdout: 'flex p-3\nm-2 py-3 hover:p-1 focus:hover:p-3',
      stderr: '',
    })
  })

  test('collapses equivalent candidates', async () => {
    let result = await runCommandLine({
      argv: ['--css', css, 'mt-2 mr-2 mb-2 ml-2'],
      stdinIsTTY: true,
      stdoutIsTTY: false,
    })

    expect(result).toEqual({
      exitCode: 0,
      stdout: 'm-2',
      stderr: '',
    })
  })

  test('renders json output for processed candidate groups', async () => {
    let result = await runCommandLine({
      argv: ['--css', css, '--format', 'json', 'py-3 p-1 px-3'],
      stdinIsTTY: true,
      stdoutIsTTY: false,
    })

    expect(result.exitCode).toBe(0)
    expect(JSON.parse(result.stdout)).toEqual([
      {
        input: 'py-3 p-1 px-3',
        output: 'p-3',
        changed: true,
      },
    ])
    expect(result.stderr).toBe('')
  })

  test('splits candidate lists with segment-aware spacing', async () => {
    let result = await runCommandLine({
      argv: ['--css', css, '--format', 'json', "content-['hello world'] p-1"],
      stdinIsTTY: true,
      stdoutIsTTY: false,
    })

    expect(result.exitCode).toBe(0)
    expect(JSON.parse(result.stdout)).toEqual([
      {
        input: "content-['hello world'] p-1",
        output: "p-1 content-['hello_world']",
        changed: true,
      },
    ])
    expect(result.stderr).toBe('')
  })

  test('shows a usage error when no candidate groups are provided', async () => {
    let result = await runCommandLine({
      argv: ['--css', css],
      stdinIsTTY: true,
      stdoutIsTTY: false,
    })

    expect(result.exitCode).toBe(1)
    expect(result.stderr).toBe('No candidate groups provided')
    expect(result.stdout).toContain('Usage:')
  })
})
