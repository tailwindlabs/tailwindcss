const { execSync } = require('child_process')
const os = require('os')
const fs = require('fs-extra')

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

it('supports postcss config files', async () => {
  // We have to run this test outside of any place with node_modules for it to properly test this situation
  let result = await inIsolatedContext(() => {
    return exec(
      '--content tests/fixtures/plugins.html --config tests/fixtures/test.config.js --postcss tests/fixtures/postcss.config.js'
    )
  })

  expect(result).toContain('.aspect-w-1')
  expect(result).toContain('.form-input')
  expect(result).toContain('.line-clamp-2')
  expect(result).toContain('.prose')
})

/**
 * @template T
 * @param {() => T} fn
 * @returns {T}
 */
async function inIsolatedContext(fn) {
  // Create a new directory entirely outside of the package for the test
  let dest = `${os.tmpdir()}/tailwindcss-cli`

  // Recursively copy the dist and tests folders
  let dirs = ['dist', 'tests']

  await Promise.all(
    dirs.map((dir) =>
      fs.copy(`${__dirname}/../${dir}`, `${dest}/${dir}`, {
        overwrite: true,
        recursive: true,
      })
    )
  )

  // Change the working directory to the new directory
  process.chdir(dest)

  console.log(dest)

  try {
    return await fn()
  } finally {
    // Change back to the original working directory
    process.chdir(__dirname)

    // Delete the new directory
    await fs.rmdir(dest, { recursive: true })
  }
}
