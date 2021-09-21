import { run, html, css } from './util/run'

test('vendor prefixes are applied by default', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="select-none bg-clip-text decoration-clone backdrop-filter-none"></div>
        `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .select-none {
        -webkit-user-select: none;
        user-select: none;
      }
      .decoration-clone {
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
      }
      .bg-clip-text {
        -webkit-background-clip: text;
        background-clip: text;
      }
      .backdrop-filter-none {
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }
    `)
  })
})

test('autoprefixer can be disabled', () => {
  let config = {
    autoprefixer: false,
    content: [
      {
        raw: html`
          <div class="select-none bg-clip-text decoration-clone backdrop-filter-none"></div>
        `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .select-none {
        user-select: none;
      }
      .decoration-clone {
        box-decoration-break: clone;
      }
      .bg-clip-text {
        background-clip: text;
      }
      .backdrop-filter-none {
        backdrop-filter: none;
      }
    `)
  })
})
