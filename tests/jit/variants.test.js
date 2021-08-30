import postcss from 'postcss'
import fs from 'fs'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  return postcss(tailwind(config)).process(input, {
    from: path.resolve(__filename),
  })
}

function css(templates) {
  return templates.join('')
}

function html(templates) {
  return templates.join('')
}

test('variants', () => {
  let config = {
    darkMode: 'class',
    mode: 'jit',
    purge: [path.resolve(__dirname, './variants.test.html')],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './variants.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

test('dark mode class variant', () => {
  let config = {
    darkMode: 'class',
    mode: 'jit',
    purge: [{ raw: html`<div class="dark:font-bold"></div>` }],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .dark .dark\\:font-bold {
        font-weight: 700;
      }
    `)
  })
})

test('dark mode media variant', () => {
  let config = {
    darkMode: 'media',
    mode: 'jit',
    purge: [{ raw: html`<div class="dark:font-bold"></div>` }],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (prefers-color-scheme: dark) {
        .dark\\:font-bold {
          font-weight: 700;
        }
      }
    `)
  })
})

test('stacked peer variants', async () => {
  let config = {
    mode: 'jit',
    purge: [{ raw: 'peer-disabled:peer-focus:peer-hover:border-blue-500' }],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  let expected = css`
    .peer:disabled:focus:hover ~ .peer-disabled\\:peer-focus\\:peer-hover\\:border-blue-500 {
      --tw-border-opacity: 1;
      border-color: rgba(59, 130, 246, var(--tw-border-opacity));
    }
  `

  let result = await run(input, config)
  expect(result.css).toIncludeCss(expected)
})
