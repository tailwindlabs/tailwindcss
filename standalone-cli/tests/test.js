const { execSync } = require('child_process')

const platformMap = {
  darwin: 'macos',
  win32: 'windows',
  linux: 'linux',
}

function exec(args) {
  return execSync(
    `./dist/tailwindcss-${platformMap[process.platform]}-${process.arch} ${args}`
  ).toString()
}

it('works', () => {
  expect(exec('--content tests/fixtures/basic.html')).toContain('.uppercase')
})

it('supports first-party plugins', () => {
  let result = exec('--content tests/fixtures/plugins.html --config tests/fixtures/test.config.js')
  expect(result).toContain('.aspect-w-1')
  expect(result).toContain('.form-input')
  expect(result).toContain('.line-clamp-2')
  expect(result).toContain('.prose')
})
