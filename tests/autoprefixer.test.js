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

test('autoprefixer options can be provided', () => {
  let config = {
    autoprefixer: { remove: false },
    content: [
      {
        raw: html` <div class="custom-class"></div> `,
      },
    ],
  }

  let input = css`
    .custom-class {
      -moz-transition: all 4s ease;
      transition: all 4s ease;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-class {
        -moz-transition: all 4s ease;
        transition: all 4s ease;
      }
    `)
  })
})
