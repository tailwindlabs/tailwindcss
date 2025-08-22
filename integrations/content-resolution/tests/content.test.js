let fs = require('fs')
let path = require('path')
let { stripVTControlCharacters } = require('util')
let { cwd } = require('./cwd.js')
let { writeConfigs, destroyConfigs } = require('./config.js')

let $ = require('../../execute')
let { css } = require('../../syntax')

let { writeInputFile, readOutputFile } = require('../../io')({
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

  // Hide console.log and console.error output
  let consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {})
  let consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {})

  // Note that ./tailwind.config.js is hardcoded on purpose here
  // It represents a config but one that could be in different places
  let result = await $(`postcss ${inputPath} -o ${outputPath}`, {
    env: { NODE_ENV: 'production', JEST_WORKER_ID: undefined },
    cwd: cwdPath,
  })

  consoleLogMock.mockRestore()
  consoleErrorMock.mockRestore()

  return {
    ...result,
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

  expect(result.css).toMatchCss(css`
    .content-\[real-static-positive\] {
      --tw-content: real-static-positive;
      content: var(--tw-content);
    }
  `)

  result = await build({ cwd: path.resolve(__dirname, '../src') })

  expect(result.css).toMatchCss(``)
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

  expect(result.css).toMatchCss(css`
    .content-\[real-static-positive\] {
      --tw-content: real-static-positive;
      content: var(--tw-content);
    }
  `)

  result = await build({ cwd: path.resolve(__dirname, '../src') })

  expect(result.css).toMatchCss(``)
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

  expect(result.css).toMatchCss(css``)

  // But here it `./real` does exist next to the config in the `./src` directory!
  result = await build({ cwd: path.resolve(__dirname, '../src') })

  expect(result.css).toMatchCss(css`
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

  expect(result.css).toMatchCss(css`
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

  expect(result.css).toMatchCss(``)
})

it('warns when globs are too broad and match node_modules', async () => {
  await writeConfigs({
    both: {
      content: {
        files: ['./**/*.html'],
      },
    },
  })

  let result = await build({ cwd: path.resolve(__dirname, '..') })

  // No issues yet, because we don't have a file that resolves inside `node_modules`
  expect(result.stderr).toEqual('')

  // We didn't scan any node_modules files yet
  expect(result.css).not.toIncludeCss(
    css`
      .content-\[\'node\\_modules\/bad\.html\'\] {
        --tw-content: 'node_modules/bad.html';
        content: var(--tw-content);
      }
    `
  )

  // Write a file that resolves inside `node_modules`
  await writeInputFile(
    'node_modules/bad.html',
    String.raw`<div class="content-['node\_modules/bad.html']">Bad</div>`
  )

  result = await build({ cwd: path.resolve(__dirname, '..') })

  // We still expect the node_modules file to be processed
  expect(result.css).toIncludeCss(
    css`
      .content-\[\'node\\_modules\/bad\.html\'\] {
        --tw-content: 'node_modules/bad.html';
        content: var(--tw-content);
      }
    `
  )

  // We didn't list `node_modules` in the glob explicitly, so we should see a
  // warning.
  expect(stripVTControlCharacters(result.stderr)).toMatchInlineSnapshot(`
    "
    warn - Your \`content\` configuration includes a pattern which looks like it's accidentally matching all of \`node_modules\` and can cause serious performance issues.
    warn - Pattern: \`./**/*.html\`
    warn - See our documentation for recommendations:
    warn - https://tailwindcss.com/docs/content-configuration#pattern-recommendations
    "
  `)
})

it('should not warn when glob contains node_modules explicitly', async () => {
  await writeConfigs({
    both: {
      content: {
        files: ['./node_modules/**/*.html'],
      },
    },
  })

  let result = await build({ cwd: path.resolve(__dirname, '..') })

  // Write a file that resolves inside `node_modules`
  await writeInputFile(
    'node_modules/bad.html',
    String.raw`<div class="content-['node\_modules/bad.html']">Bad</div>`
  )

  result = await build({ cwd: path.resolve(__dirname, '..') })

  // We still expect the node_modules file to be processed
  expect(result.css).toIncludeCss(
    css`
      .content-\[\'node\\_modules\/bad\.html\'\] {
        --tw-content: 'node_modules/bad.html';
        content: var(--tw-content);
      }
    `
  )

  // We explicitly listed `node_modules` in the glob, so we shouldn't see a
  // warning.
  expect(result.stderr).toEqual('')
})

it('should not warn when globs are too broad if other glob match node_modules explicitly', async () => {
  await writeConfigs({
    both: {
      content: {
        files: ['./**/*.html', './node_modules/bad.html'],
      },
    },
  })

  let result = await build({ cwd: path.resolve(__dirname, '..') })

  // No issues yet, because we don't have a file that resolves inside `node_modules`
  expect(result.stderr).toEqual('')

  // We didn't scan any node_modules files yet
  expect(result.css).not.toIncludeCss(
    css`
      .content-\[\'node\\_modules\/bad\.html\'\] {
        --tw-content: 'node_modules/bad.html';
        content: var(--tw-content);
      }
    `
  )

  // Write a file that resolves inside `node_modules`
  await writeInputFile(
    'node_modules/bad.html',
    String.raw`<div class="content-['node\_modules/bad.html']">Bad</div>`
  )

  result = await build({ cwd: path.resolve(__dirname, '..') })

  // We still expect the node_modules file to be processed
  expect(result.css).toIncludeCss(
    css`
      .content-\[\'node\\_modules\/bad\.html\'\] {
        --tw-content: 'node_modules/bad.html';
        content: var(--tw-content);
      }
    `
  )

  // We explicitly listed `node_modules` in the glob, so we shouldn't see a
  // warning.
  expect(result.stderr).toEqual('')

  // Write a file that resolves inside `node_modules` but is not covered by the
  // explicit glob patterns.
  await writeInputFile(
    'node_modules/very-very-bad.html',
    String.raw`<div class="content-['node\_modules/very-very-bad.html']">Bad</div>`
  )

  result = await build({ cwd: path.resolve(__dirname, '..') })

  // We still expect the node_modules file to be processed
  expect(result.css).toIncludeCss(
    css`
      .content-\[\'node\\_modules\/very-very-bad\.html\'\] {
        --tw-content: 'node_modules/very-very-bad.html';
        content: var(--tw-content);
      }
    `
  )

  // The very-very-bad.html file is not covered by the explicit glob patterns,
  // so we should see a warning.
  expect(stripVTControlCharacters(result.stderr)).toMatchInlineSnapshot(`
    "
    warn - Your \`content\` configuration includes a pattern which looks like it's accidentally matching all of \`node_modules\` and can cause serious performance issues.
    warn - Pattern: \`./**/*.html\`
    warn - See our documentation for recommendations:
    warn - https://tailwindcss.com/docs/content-configuration#pattern-recommendations
    "
  `)
})

it('should not warn when a negative glob is used', async () => {
  await writeConfigs({
    both: {
      content: {
        files: ['./**/*.html', '!./node_modules/**/*.html'],
      },
    },
  })

  // Write a file that resolves inside `node_modules`
  await writeInputFile(
    'node_modules/bad.html',
    String.raw`<div class="content-['node\_modules/bad.html']">Bad</div>`
  )

  let result = await build({ cwd: path.resolve(__dirname, '..') })

  // The initial glob resolving shouldn't use the node_modules file
  // in the first place.

  // We still expect the node_modules file to be processed
  expect(result.css).not.toIncludeCss(
    css`
      .content-\[\'node\\_modules\/bad\.html\'\] {
        --tw-content: 'node_modules/bad.html';
        content: var(--tw-content);
      }
    `
  )

  // The node_modules file shouldn't have been processed at all because it was
  // ignored by the negative glob.
  expect(result.stderr).toEqual('')
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

  expect(result.css).toMatchCss(``)

  // But here it `./real` does exist next to the config in the `./src` directory!
  result = await build({ cwd: path.resolve(__dirname, '../src') })

  expect(result.css).toMatchCss(css`
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

  expect(result.css).toMatchCss(css`
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

  expect(result.css).toMatchCss(``)
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

  expect(result.css).toMatchCss(``)

  // But here it `./real` does exist next to the config in the `./src` directory!
  result = await build({ cwd: path.resolve(__dirname, '../src') })

  expect(result.css).toMatchCss(css`
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
