import path from 'path'
import { css, run } from '../util/run.js'
import { cwd } from './cwd.js'
import { writeConfigs, destroyConfigs } from './config.js'
import fs from 'fs'

// Write default configs before running tests and remove them afterwards
beforeAll(() => writeConfigs())
afterAll(() => destroyConfigs())

// Create a symlink at ./files/link that points to ./files/resolved and remove it afterwards
beforeAll(() =>
  fs.promises.symlink(
    path.resolve(__dirname, './files/resolved'),
    path.resolve(__dirname, './files/link')
  )
)
afterAll(() => fs.promises.unlink(path.resolve(__dirname, './files/link')))

// If we've changed directories reset the cwd back to what it was before running these tests
afterEach(() => cwd.unwind())

async function build({ cwd: cwdPath } = {}) {
  await cwd.switch(cwdPath)

  // Note that ./content.tailwind.config.js is hardcoded on purpose here
  // It represents a config but one that could be in different places
  return await run('@tailwind utilities', './content.tailwind.config.js')
}

fit('looks in the CWD by default', async () => {
  await writeConfigs({
    both: {
      content: {
        files: ['./files/real/yes.html'],
      },
    },
  })

  let result = await build({ cwd: __dirname })

  expect(result.css).toMatchCss(css`
    .content-\[real-static-positive\] {
      --tw-content: real-static-positive;
      content: var(--tw-content);
    }
  `)

  result = await build({ cwd: path.resolve(__dirname, './files') })

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
        files: ['./files/real/yes.html'],
      },
    },
  })

  let result = await build({ cwd: __dirname })

  expect(result.css).toMatchCss(css`
    .content-\[real-static-positive\] {
      --tw-content: real-static-positive;
      content: var(--tw-content);
    }
  `)

  result = await build({ cwd: path.resolve(__dirname, './files') })

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
  let result = await build({ cwd: __dirname })

  expect(result.css).toMatchCss(css``)

  // But here it `./real` does exist next to the config in the `./files` directory!
  result = await build({ cwd: path.resolve(__dirname, './files') })

  expect(result.css).toMatchCss(css`
    .content-\[real-static-positive\] {
      --tw-content: real-static-positive;
      content: var(--tw-content);
    }
  `)
})

// it('it handles ignored globs correctly when not relative to the config', async () => {
//   await writeConfigs({
//     both: {
//       content: {
//         relative: false,
//         files: [
//           './files/real/yes.html', // Scanned + static
//           './files/real/*.js', // Scanned + dynamic
//           '!./files/real/no.js', // Ignored + static
//           '!./files/real/no-*.js', // Ignored + dynamic
//         ],
//       },
//     },
//   })

//   let result = await build({ cwd: __dirname })

//   expect(result.css).toMatchCss(css`
//     .content-\[real-static-positive\] {
//       --tw-content: real-static-positive;
//       content: var(--tw-content);
//     }
//     .content-\[real-dynamic-positive\] {
//       --tw-content: real-dynamic-positive;
//       content: var(--tw-content);
//     }
//   `)

//   // But here it `./real` does exist next to the config in the `./files` directory!
//   result = await build({ cwd: path.resolve(__dirname, './files') })

//   expect(result.css).toMatchCss(``)
// })

// it('it handles ignored globs correctly when relative to the config', async () => {
//   await writeConfigs({
//     both: {
//       content: {
//         relative: true,
//         files: [
//           './real/yes.html', // Scanned + static
//           './real/*.js', // Scanned + dynamic
//           '!./real/no.js', // Ignored + static
//           '!./real/no-*.js', // Ignored + dynamic
//         ],
//       },
//     },
//   })

//   let result = await build({ cwd: __dirname })

//   expect(result.css).toMatchCss(``)

//   // But here it `./real` does exist next to the config in the `./files` directory!
//   result = await build({ cwd: path.resolve(__dirname, './files') })

//   expect(result.css).toMatchCss(css`
//     .content-\[real-static-positive\] {
//       --tw-content: real-static-positive;
//       content: var(--tw-content);
//     }
//     .content-\[real-dynamic-positive\] {
//       --tw-content: real-dynamic-positive;
//       content: var(--tw-content);
//     }
//   `)
// })

// it('it can resolve symlinks for files when not relative to the config', async () => {
//   await writeConfigs({
//     both: {
//       content: {
//         relative: false,
//         files: [
//           './files/real/yes.html', // Scanned + static
//           './files/real/*.js', // Scanned + dynamic
//           './files/link/yes.html', // Scanned + static + symlinked
//           './files/link/*.js', // Scanned + dynamic + symlinked
//           '!./files/real/no.js', // Ignored + static
//           '!./files/real/no-*.js', // Ignored + dynamic
//           '!./files/link/no.js', // Ignored + static + symlinked
//           '!./files/link/no-*.js', // Ignored + dynamic + symlinked
//         ],
//       },
//     },
//   })

//   let result = await build({ cwd: __dirname })

//   expect(result.css).toMatchCss(css`
//     .content-\[real-static-positive\] {
//       --tw-content: real-static-positive;
//       content: var(--tw-content);
//     }
//     .content-\[resolved-static-positive\] {
//       --tw-content: resolved-static-positive;
//       content: var(--tw-content);
//     }
//     .content-\[real-dynamic-positive\] {
//       --tw-content: real-dynamic-positive;
//       content: var(--tw-content);
//     }
//     .content-\[resolved-dynamic-positive\] {
//       --tw-content: resolved-dynamic-positive;
//       content: var(--tw-content);
//     }
//   `)

//   // But here it `./real` does exist next to the config in the `./files` directory!
//   result = await build({ cwd: path.resolve(__dirname, './files') })

//   expect(result.css).toMatchCss(``)
// })

// it('it can resolve symlinks for files when relative to the config', async () => {
//   await writeConfigs({
//     both: {
//       content: {
//         relative: true,
//         files: [
//           './real/yes.html', // Scanned + static
//           './real/*.js', // Scanned + dynamic
//           './link/yes.html', // Scanned + static + symlinked
//           './link/*.js', // Scanned + dynamic + symlinked
//           '!./real/no.js', // Ignored + static
//           '!./real/no-*.js', // Ignored + dynamic
//           '!./link/no.js', // Ignored + static + symlinked
//           '!./link/no-*.js', // Ignored + dynamic + symlinked
//         ],
//       },
//     },
//   })

//   let result = await build({ cwd: __dirname })

//   expect(result.css).toMatchCss(``)

//   // But here it `./real` does exist next to the config in the `./files` directory!
//   result = await build({ cwd: path.resolve(__dirname, './files') })

//   expect(result.css).toMatchCss(css`
//     .content-\[real-static-positive\] {
//       --tw-content: real-static-positive;
//       content: var(--tw-content);
//     }
//     .content-\[resolved-static-positive\] {
//       --tw-content: resolved-static-positive;
//       content: var(--tw-content);
//     }
//     .content-\[real-dynamic-positive\] {
//       --tw-content: real-dynamic-positive;
//       content: var(--tw-content);
//     }
//     .content-\[resolved-dynamic-positive\] {
//       --tw-content: resolved-dynamic-positive;
//       content: var(--tw-content);
//     }
//   `)
// })
