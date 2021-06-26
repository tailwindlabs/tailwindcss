import postcss from 'postcss'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  const { currentTestName } = expect.getState()

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

test('border-width utilities generate default border color base styles', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="border border-2 border-4 border-black border-opacity-75"></div>',
      },
    ],
    theme: {},
    corePlugins: { preflight: false },
    plugins: [],
  }

  let css = `
    @tailwind base;
    /* --- */
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .border,
      .border-2,
      .border-4 {
        --tw-border-opacity: 1;
        border-color: rgba(229, 231, 235, var(--tw-border-opacity));
      }
      /* --- */
      .border {
        border-width: 1px;
      }
      .border-2 {
        border-width: 2px;
      }
      .border-4 {
        border-width: 4px;
      }
      .border-black {
        --tw-border-opacity: 1;
        border-color: rgba(0, 0, 0, var(--tw-border-opacity));
      }
      .border-opacity-75 {
        --tw-border-opacity: 0.75;
      }
    `)
  })
})

test('opacity variable is not added if borderOpacity plugin is disabled', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="border"></div>',
      },
    ],
    theme: {},
    corePlugins: { preflight: false, borderOpacity: false },
    plugins: [],
  }

  let css = `
    @tailwind base;
    /* --- */
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .border {
        border-color: #e5e7eb;
      }
      /* --- */
      .border {
        border-width: 1px;
      }
    `)
  })
})
