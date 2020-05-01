import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import tailwind from '../src/index'
import defaultConfig from '../stubs/defaultConfig.stub.js'

const config = {
  ...defaultConfig,
  theme: {
    extend: {
      colors: {
        'black!': '#000',
      },
      spacing: {
        '1.5': '0.375rem',
        '(1/2+8)': 'calc(50% + 2rem)',
      },
      minHeight: {
        '(screen-4)': 'calc(100vh - 1rem)',
      },
      fontFamily: {
        '%#$@': 'Comic Sans',
      },
    },
  },
}

function assertPurged(result) {
  expect(result.css).not.toContain('.bg-red-600')
  expect(result.css).not.toContain('.w-1\\/3')
  expect(result.css).not.toContain('.flex')
  expect(result.css).not.toContain('.font-sans')
  expect(result.css).not.toContain('.text-right')
  expect(result.css).not.toContain('.px-4')
  expect(result.css).not.toContain('.h-full')

  expect(result.css).toContain('.bg-red-500')
  expect(result.css).toContain('.md\\:bg-blue-300')
  expect(result.css).toContain('.w-1\\/2')
  expect(result.css).toContain('.block')
  expect(result.css).toContain('.md\\:flow-root')
  expect(result.css).toContain('.h-screen')
  expect(result.css).toContain('.min-h-\\(screen-4\\)')
  expect(result.css).toContain('.bg-black\\!')
  expect(result.css).toContain('.font-\\%\\#\\$\\@')
  expect(result.css).toContain('.w-\\(1\\/2\\+8\\)')
  expect(result.css).toContain('.inline-grid')
  expect(result.css).toContain('.grid-cols-3')
  expect(result.css).toContain('.px-1\\.5')
  expect(result.css).toContain('.col-span-2')
  expect(result.css).toContain('.col-span-1')
  expect(result.css).toContain('.text-center')
  expect(result.css).toContain('.flow-root')
  expect(result.css).toContain('.text-green-700')
  expect(result.css).toContain('.bg-green-100')
  expect(result.css).toContain('.text-left')
  expect(result.css).toContain('.font-mono')
  expect(result.css).toContain('.col-span-4')
  expect(result.css).toContain('.tracking-tight')
  expect(result.css).toContain('.tracking-tight')
}

test('purges unused classes', () => {
  const OLD_NODE_ENV = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
  const input = fs.readFileSync(inputPath, 'utf8')

  return postcss([
    tailwind({
      ...config,
      purge: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
    }),
  ])
    .process(input, { from: inputPath })
    .then(result => {
      process.env.NODE_ENV = OLD_NODE_ENV

      assertPurged(result)
    })
})

test('does not purge components', () => {
  const OLD_NODE_ENV = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
  const input = fs.readFileSync(inputPath, 'utf8')

  return postcss([
    tailwind({
      ...config,
      purge: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
    }),
  ])
    .process(input, { from: inputPath })
    .then(result => {
      process.env.NODE_ENV = OLD_NODE_ENV

      expect(result.css).toContain('.container')
      assertPurged(result)
    })
})

test('does not purge except in production', () => {
  const OLD_NODE_ENV = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
  const input = fs.readFileSync(inputPath, 'utf8')

  return postcss([
    tailwind({
      ...defaultConfig,
      purge: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
    }),
  ])
    .process(input, { from: inputPath })
    .then(result => {
      process.env.NODE_ENV = OLD_NODE_ENV
      const expected = fs.readFileSync(
        path.resolve(`${__dirname}/fixtures/tailwind-output.css`),
        'utf8'
      )

      expect(result.css).toBe(expected)
    })
})

test('does not purge if the array is empty', () => {
  const OLD_NODE_ENV = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
  const input = fs.readFileSync(inputPath, 'utf8')

  return postcss([
    tailwind({
      ...defaultConfig,
      purge: [],
    }),
  ])
    .process(input, { from: inputPath })
    .then(result => {
      process.env.NODE_ENV = OLD_NODE_ENV
      const expected = fs.readFileSync(
        path.resolve(`${__dirname}/fixtures/tailwind-output.css`),
        'utf8'
      )

      expect(result.css).toBe(expected)
    })
})

test('does not purge if explicitly disabled', () => {
  const OLD_NODE_ENV = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
  const input = fs.readFileSync(inputPath, 'utf8')

  return postcss([
    tailwind({
      ...defaultConfig,
      purge: { enabled: false },
    }),
  ])
    .process(input, { from: inputPath })
    .then(result => {
      process.env.NODE_ENV = OLD_NODE_ENV
      const expected = fs.readFileSync(
        path.resolve(`${__dirname}/fixtures/tailwind-output.css`),
        'utf8'
      )

      expect(result.css).toBe(expected)
    })
})

test('does not purge if purge is simply false', () => {
  const OLD_NODE_ENV = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
  const input = fs.readFileSync(inputPath, 'utf8')

  return postcss([
    tailwind({
      ...defaultConfig,
      purge: false,
    }),
  ])
    .process(input, { from: inputPath })
    .then(result => {
      process.env.NODE_ENV = OLD_NODE_ENV
      const expected = fs.readFileSync(
        path.resolve(`${__dirname}/fixtures/tailwind-output.css`),
        'utf8'
      )

      expect(result.css).toBe(expected)
    })
})

test('purges outside of production if explicitly enabled', () => {
  const OLD_NODE_ENV = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
  const input = fs.readFileSync(inputPath, 'utf8')

  return postcss([
    tailwind({
      ...config,
      purge: { enabled: true, content: [path.resolve(`${__dirname}/fixtures/**/*.html`)] },
    }),
  ])
    .process(input, { from: inputPath })
    .then(result => {
      process.env.NODE_ENV = OLD_NODE_ENV

      assertPurged(result)
    })
})

test('purgecss options can be provided', () => {
  const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
  const input = fs.readFileSync(inputPath, 'utf8')

  return postcss([
    tailwind({
      ...config,
      purge: {
        enabled: true,
        options: {
          content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
          whitelist: ['md:bg-green-500'],
        },
      },
    }),
  ])
    .process(input, { from: inputPath })
    .then(result => {
      expect(result.css).toContain('.md\\:bg-green-500')
      assertPurged(result)
    })
})

test('can purge all CSS, not just Tailwind classes', () => {
  const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
  const input = fs.readFileSync(inputPath, 'utf8')

  return postcss([
    tailwind({
      ...config,
      purge: {
        enabled: true,
        mode: 'all',
        content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
      },
    }),
    function(css) {
      // Remove any comments to avoid accidentally asserting against them
      // instead of against real CSS rules.
      css.walkComments(c => c.remove())
    },
  ])
    .process(input, { from: inputPath })
    .then(result => {
      expect(result.css).toContain('html')
      expect(result.css).toContain('body')
      expect(result.css).toContain('samp')
      expect(result.css).not.toContain('button')
      expect(result.css).not.toContain('legend')
      expect(result.css).not.toContain('progress')

      assertPurged(result)
    })
})

test('the `conservative` mode can be set explicitly', () => {
  const OLD_NODE_ENV = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
  const input = fs.readFileSync(inputPath, 'utf8')

  return postcss([
    tailwind({
      ...config,
      purge: {
        mode: 'conservative',
        content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
      },
    }),
  ])
    .process(input, { from: inputPath })
    .then(result => {
      process.env.NODE_ENV = OLD_NODE_ENV

      expect(result.css).not.toContain('.bg-red-600')
      expect(result.css).not.toContain('.w-1\\/3')
      expect(result.css).not.toContain('.flex')
      expect(result.css).not.toContain('.font-sans')
      expect(result.css).not.toContain('.text-right')
      expect(result.css).not.toContain('.px-4')
      expect(result.css).not.toContain('.h-full')

      expect(result.css).toContain('.bg-red-500')
      expect(result.css).toContain('.md\\:bg-blue-300')
      expect(result.css).toContain('.w-1\\/2')
      expect(result.css).toContain('.block')
      expect(result.css).toContain('.md\\:flow-root')
      expect(result.css).toContain('.h-screen')
      expect(result.css).toContain('.min-h-\\(screen-4\\)')
      expect(result.css).toContain('.bg-black\\!')
      expect(result.css).toContain('.font-\\%\\#\\$\\@')
      expect(result.css).toContain('.w-\\(1\\/2\\+8\\)')
      expect(result.css).toContain('.inline-grid')
      expect(result.css).toContain('.grid-cols-3')
      expect(result.css).toContain('.px-1\\.5')
      expect(result.css).toContain('.col-span-2')
      expect(result.css).toContain('.col-span-1')
      expect(result.css).toContain('.text-center')
    })
})
