import postcss from 'postcss'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  const { currentTestName } = expect.getState()

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

test('basic color opacity modifier', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="bg-red-500/50"></div>',
      },
    ],
    theme: {},
    plugins: [],
  }

  let css = `@tailwind utilities`

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .bg-red-500\\/50 {
        background-color: rgba(239, 68, 68, 0.5);
      }
    `)
  })
})

test('colors with slashes are matched first', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="bg-red-500/50"></div>',
      },
    ],
    theme: {
      extend: {
        colors: {
          'red-500/50': '#ff0000',
        },
      },
    },
    plugins: [],
  }

  let css = `@tailwind utilities`

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .bg-red-500\\/50 {
        --tw-bg-opacity: 1;
        background-color: rgba(255, 0, 0, var(--tw-bg-opacity));
      }
    `)
  })
})

test('arbitrary color opacity modifier', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: 'bg-red-500/[var(--opacity)]',
      },
    ],
    theme: {},
    plugins: [],
  }

  let css = `@tailwind utilities`

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .bg-red-500\\/\\[var\\(--opacity\\)\\] {
        background-color: rgba(239, 68, 68, var(--opacity));
      }
    `)
  })
})

test('missing alpha generates nothing', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="bg-red-500/"></div>',
      },
    ],
    theme: {},
    plugins: [],
  }

  let css = `@tailwind utilities`

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(``)
  })
})

test('values not in the opacity config are ignored', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="bg-red-500/29"></div>',
      },
    ],
    theme: {
      opacity: {
        0: '0',
        25: '0.25',
        5: '0.5',
        75: '0.75',
        100: '1',
      },
    },
    plugins: [],
  }

  let css = `@tailwind utilities`

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(``)
  })
})
