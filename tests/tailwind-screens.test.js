import { run, html, css } from './util/run'

test('class variants are inserted at `@tailwind variants`', async () => {
  let config = {
    content: [{ raw: html`<div class="font-bold hover:font-bold md:font-bold"></div>` }],
  }

  let input = css`
    @tailwind utilities;
    @tailwind variants;
    .foo {
      color: black;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
      .hover\:font-bold:hover {
        font-weight: 700;
      }
      @media (min-width: 768px) {
        .md\:font-bold {
          font-weight: 700;
        }
      }
      .foo {
        color: black;
      }
    `)
  })
})

test('`@tailwind screens` works as an alias for `@tailwind variants`', async () => {
  let config = {
    content: [{ raw: html`<div class="font-bold hover:font-bold md:font-bold"></div>` }],
  }

  let input = css`
    @tailwind utilities;
    @tailwind screens;
    .foo {
      color: black;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
      .hover\:font-bold:hover {
        font-weight: 700;
      }
      @media (min-width: 768px) {
        .md\:font-bold {
          font-weight: 700;
        }
      }
      .foo {
        color: black;
      }
    `)
  })
})

test('screen names are in the correct order', () => {
  // Using custom css function here, because otherwise with String.raw, we run
  // into an issue with `\31 ` escapes. If we use `\31 ` then JS complains
  // about strict mode. But `\\31 ` is not what it expected.
  function css(templates) {
    return templates.join('')
  }

  let config = {
    content: [
      {
        raw: html`<div
          class="768:font-light 1200:font-normal 1800:font-bold max-w-768 container"
        ></div>`,
      },
    ],
    theme: {
      screens: [
        [1800, { max: '1800px' }],
        [1200, { max: '1200px' }],
        [768, { max: '768px' }],
      ],
    },
  }

  return run('@tailwind utilities;', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      @media (max-width: 1800px) {
        .\\31 800\\:font-bold {
          font-weight: 700;
        }
      }

      @media (max-width: 1200px) {
        .\\31 200\\:font-normal {
          font-weight: 400;
        }
      }

      @media (max-width: 768px) {
        .\\37 68\\:font-light {
          font-weight: 300;
        }
      }
    `)
  })
})
