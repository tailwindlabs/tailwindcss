import fs from 'fs'
import path from 'path'

import { run, html, css } from './util/run'

test('collapse adjacent rules', () => {
  let config = {
    content: [path.resolve(__dirname, './collapse-adjacent-rules.test.html')],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [
      function ({ addVariant }) {
        addVariant('foo-bar', '@supports (foo: bar)')
      },
    ],
  }

  let input = css`
    @tailwind base;
    @font-face {
      font-family: 'Inter';
      src: url('/fonts/Inter.woff2') format('woff2'), url('/fonts/Inter.woff') format('woff');
    }
    @font-face {
      font-family: 'Gilroy';
      src: url('/fonts/Gilroy.woff2') format('woff2'), url('/fonts/Gilroy.woff') format('woff');
    }
    @page {
      margin: 1cm;
    }
    @tailwind components;
    @tailwind utilities;
    @layer base {
      @font-face {
        font-family: 'Poppins';
        src: url('/fonts/Poppins.woff2') format('woff2'), url('/fonts/Poppins.woff') format('woff');
      }
      @font-face {
        font-family: 'Proxima Nova';
        src: url('/fonts/ProximaNova.woff2') format('woff2'),
          url('/fonts/ProximaNova.woff') format('woff');
      }
    }
    .foo,
    .bar {
      color: black;
    }
    .foo,
    .bar {
      font-weight: 700;
    }
    .some-apply-thing {
      @apply foo-bar:md:text-black foo-bar:md:font-bold foo-bar:text-black foo-bar:font-bold md:font-bold md:text-black;
    }
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './collapse-adjacent-rules.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

test('duplicate url imports does not break rule collapsing', () => {
  let config = {
    content: [{ raw: html`` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @import url('https://example.com');
    @import url('https://example.com');
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @import url('https://example.com');
    `)
  })
})
