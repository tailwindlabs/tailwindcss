const { execSync } = require('child_process')
const os = require('os')
const fs = require('fs-extra')

const platformMap = {
  darwin: `./dist/tailwindcss-macos-${process.arch}`,
  linux: `./dist/tailwindcss-linux-${process.arch}`,
  win32: `.\\dist\\tailwindcss-windows-${process.arch}`,
}

function exec(args) {
  return execSync(`${platformMap[process.platform]} ${args}`).toString()
}

it('works', () => {
  let result = exec('--content tests/fixtures/basic.html')
  expect(result).toContain('.uppercase')
  expect(result).toContain('.\\[will-change\\:opacity\\]')
  expect(result).toContain('will-change: opacity')

  // Verify that no plugins are installed that modify the `[will-change:opacity]` class
  expect(result).not.toContain('backface-visibility: hidden')
})

it('supports first-party plugins', () => {
  let result = exec('--content tests/fixtures/plugins.html --config tests/fixtures/test.config.js')
  expect(result).toContain('.aspect-w-1')
  expect(result).toContain('.form-input')
  expect(result).toContain('.line-clamp-2')
  expect(result).toContain('.prose')
  expect(result).toContain('@container')
  expect(result).toContain('@md\\:bg-teal-600')
})

it('supports postcss config files', async () => {
  // We have to run this test outside of any place with node_modules for it to properly test this situation
  let result = await inIsolatedContext(() => {
    // Emulate the user adding their own postcss plugins
    execSync(`npm install postcss-will-change`)

    return exec('--content tests/fixtures/basic.html --postcss tests/fixtures/postcss.config.js')
  })

  expect(result).toContain('.uppercase')

  // Ensure the custom added postcss plugin is working
  expect(result).toContain('will-change: opacity')
  expect(result).toContain('backface-visibility: hidden')
})

/**
 * @template T
 * @param {() => T} fn
 * @returns {Promise<T>}
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

  try {
    return await fn()
  } finally {
    // Change back to the original working directory
    process.chdir(__dirname)

    // Delete the new directory
    await fs.rm(dest, { recursive: true })
  }
}
