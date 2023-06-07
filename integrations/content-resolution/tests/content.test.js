let fs = require('fs')
let path = require('path')
let { cwd } = require('./cwd.js')
let { writeConfigs, destroyConfigs } = require('./config.js')

let $ = require('../../execute')
let { css } = require('../../syntax')

let { readOutputFile } = require('../../io')({
  output: 'dist',
  input: '.',
})

// Write default configs before running tests and remove them afterwards
beforeAll(() => writeConfigs())
afterAll(() => destroyConfigs())

// Create a symlink at ./src/link that points to ./src/resolved and remove it afterwards
beforeAll(() =>
  fs.promises.symlink(
    path.resolve(__dirname, '../src/resolved'),
    path.resolve(__dirname, '../src/link')
  )
)
afterAll(async () => {
  try {
    await fs.promises.unlink(path.resolve(__dirname, '../src/link'))
  } catch {}
})

// If we've changed directories reset the cwd back to what it was before running these tests
afterEach(() => cwd.unwind())

async function build({ cwd: cwdPath } = {}) {
  let inputPath = path.resolve(__dirname, '../src/index.css')
  let outputPath = path.resolve(__dirname, '../dist/main.css')

  await cwd.switch(cwdPath)

  // Note that ./tailwind.config.js is hardcoded on purpose here
  // It represents a config but one that could be in different places
  await $(`postcss ${inputPath} -o ${outputPath}`, {
    env: { NODE_ENV: 'production' },
    cwd: cwdPath,
  })

  return {
    css: await readOutputFile('main.css'),
  }
}

it('looks in the CWD by default', async () => {
  await writeConfigs({
    both: {
      content: {
        files: ['./src/real/yes.html'],
      },
    },
  })

  let result = await build({ cwd: path.resolve(__dirname, '..') })

  expect(result.css).toMatchFormattedCss(css`
    .content-\[real-static-positive\] {
      --tw-content: real-static-positive;
      content: var(--tw-content);
    }
  `)

  result = await build({ cwd: path.resolve(__dirname, '../src') })

  expect(result.css).toMatchFormattedCss(``)
})

it('looks in the CWD for non-config-relative paths', async () => {
  await writeConfigs({
    both: {
      // Turn it on by default (eventual v4 behavior)
      experimental: { relativeContentPathsByDefault: true },

      // But then disable it anyway
      content: {
        relative: false,
        files: ['./src/real/yes.html'],
      },
    },
  })

  let result = await build({ cwd: path.resolve(__dirname, '..') })

  expect(result.css).toMatchFormattedCss(css`
    .content-\[real-static-positive\] {
      --tw-content: real-static-positive;
      content: var(--tw-content);
    }
  `)

  result = await build({ cwd: path.resolve(__dirname, '../src') })

  expect(result.css).toMatchFormattedCss(``)
})

it('can look for content files relative to the config', async () => {
  await writeConfigs({
    both: {
      content: {
        relative: true,
        files: ['./real/yes.html'],
      },
    },
  })

  // Here `./real` doesn't exist next to the config in the root directory
  let result = await build({ cwd: path.resolve(__dirname, '..') })

  expect(result.css).toMatchFormattedCss(css``)

  // But here it `./real` does exist next to the config in the `./src` directory!
  result = await build({ cwd: path.resolve(__dirname, '../src') })

  expect(result.css).toMatchFormattedCss(css`
    .content-\[real-static-positive\] {
      --tw-content: real-static-positive;
      content: var(--tw-content);
    }
  `)
})

it('it handles ignored globs correctly when not relative to the config', async () => {
  await writeConfigs({
    both: {
      content: {
        relative: false,
        files: [
          './src/real/yes.html', // Scanned + static
          './src/real/*.js', // Scanned + dynamic
          '!./src/real/no.js', // Ignored + static
          '!./src/real/no-*.js', // Ignored + dynamic
        ],
      },
    },
  })

  let result = await build({ cwd: path.resolve(__dirname, '..') })

  expect(result.css).toMatchFormattedCss(css`
    .content-\[real-dynamic-positive\] {
      --tw-content: real-dynamic-positive;
      content: var(--tw-content);
    }
    .content-\[real-static-positive\] {
      --tw-content: real-static-positive;
      content: var(--tw-content);
    }
  `)

  // But here it `./real` does exist next to the config in the `./src` directory!
  result = await build({ cwd: path.resolve(__dirname, '../src') })

  expect(result.css).toMatchFormattedCss(``)
})

it('it handles ignored globs correctly when relative to the config', async () => {
  await writeConfigs({
    both: {
      content: {
        relative: true,
        files: [
          './real/yes.html', // Scanned + static
          './real/*.js', // Scanned + dynamic
          '!./real/no.js', // Ignored + static
          '!./real/no-*.js', // Ignored + dynamic
        ],
      },
    },
  })

  let result = await build({ cwd: path.resolve(__dirname, '..') })

  expect(result.css).toMatchFormattedCss(``)

  // But here it `./real` does exist next to the config in the `./src` directory!
  result = await build({ cwd: path.resolve(__dirname, '../src') })

  expect(result.css).toMatchFormattedCss(css`
    .content-\[real-dynamic-positive\] {
      --tw-content: real-dynamic-positive;
      content: var(--tw-content);
    }
    .content-\[real-static-positive\] {
      --tw-content: real-static-positive;
      content: var(--tw-content);
    }
  `)
})

it('it can resolve symlinks for files when not relative to the config', async () => {
  await writeConfigs({
    both: {
      content: {
        relative: false,
        files: [
          './src/real/yes.html', // Scanned + static
          './src/real/*.js', // Scanned + dynamic
          './src/link/yes.html', // Scanned + static + symlinked
          './src/link/*.js', // Scanned + dynamic + symlinked
          '!./src/real/no.js', // Ignored + static
          '!./src/real/no-*.js', // Ignored + dynamic
          '!./src/link/no.js', // Ignored + static + symlinked
          '!./src/link/no-*.js', // Ignored + dynamic + symlinked
        ],
      },
    },
  })

  let result = await build({ cwd: path.resolve(__dirname, '..') })

  expect(result.css).toMatchFormattedCss(css`
    .content-\[real-dynamic-positive\] {
      --tw-content: real-dynamic-positive;
      content: var(--tw-content);
    }
    .content-\[real-static-positive\] {
      --tw-content: real-static-positive;
      content: var(--tw-content);
    }
    .content-\[resolved-dynamic-positive\] {
      --tw-content: resolved-dynamic-positive;
      content: var(--tw-content);
    }
    .content-\[resolved-static-positive\] {
      --tw-content: resolved-static-positive;
      content: var(--tw-content);
    }
  `)

  // But here it `./real` does exist next to the config in the `./src` directory!
  result = await build({ cwd: path.resolve(__dirname, '../src') })

  expect(result.css).toMatchFormattedCss(``)
})

it('it can resolve symlinks for files when relative to the config', async () => {
  await writeConfigs({
    both: {
      content: {
        relative: true,
        files: [
          './real/yes.html', // Scanned + static
          './real/*.js', // Scanned + dynamic
          './link/yes.html', // Scanned + static + symlinked
          './link/*.js', // Scanned + dynamic + symlinked
          '!./real/no.js', // Ignored + static
          '!./real/no-*.js', // Ignored + dynamic
          '!./link/no.js', // Ignored + static + symlinked
          '!./link/no-*.js', // Ignored + dynamic + symlinked
        ],
      },
    },
  })

  let result = await build({ cwd: path.resolve(__dirname, '..') })

  expect(result.css).toMatchFormattedCss(``)

  // But here it `./real` does exist next to the config in the `./src` directory!
  result = await build({ cwd: path.resolve(__dirname, '../src') })

  expect(result.css).toMatchFormattedCss(css`
    .content-\[real-dynamic-positive\] {
      --tw-content: real-dynamic-positive;
      content: var(--tw-content);
    }
    .content-\[real-static-positive\] {
      --tw-content: real-static-positive;
      content: var(--tw-content);
    }
    .content-\[resolved-dynamic-positive\] {
      --tw-content: resolved-dynamic-positive;
      content: var(--tw-content);
    }
    .content-\[resolved-static-positive\] {
      --tw-content: resolved-static-positive;
      content: var(--tw-content);
    }
  `)
})
