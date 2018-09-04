import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'

function runCli(task, options) {
  return spawnSync('node', [`${path.join(process.cwd(), 'lib/cli.js')}`, `${task}`, ...options])
}

function pathToFixture(fixture) {
  return path.resolve(`${__dirname}/fixtures/${fixture}`)
}

function readFixture(fixture) {
  return fs.readFileSync(pathToFixture(fixture), 'utf8')
}

test('stdout only contains processed output', () => {
  const expected = readFixture('tailwind-cli-output.css')
  const result = runCli('build', [pathToFixture('tailwind-cli-input.css')])
  expect(result.stdout.toString()).toEqual(expected)
})

test('output can be minified', () => {
  const expected = readFixture('tailwind-cli-minify-output.css').trim()
  const result = runCli('build', [pathToFixture('tailwind-cli-input.css'), '--minify'])
  expect(result.stdout.toString()).toEqual(expected)
})

test('output can exclude unused styles', () => {
  const expected = readFixture('tailwind-cli-purge-output.css')
  const result = runCli('build', [
    pathToFixture('tailwind-cli-input.css'),
    '--purge',
    pathToFixture('tailwind-cli-purge-content.html'),
  ])
  expect(result.stdout.toString()).toEqual(expected)
})
