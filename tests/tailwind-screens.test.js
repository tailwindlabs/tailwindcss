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
      .font-bold,
      .hover\:font-bold:hover {
        font-weight: 700;
      }
      @media (min-width: 768px) {
        .md\:font-bold {
          font-weight: 700;
        }
      }
      .foo {
        color: #000;
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
      .font-bold,
      .hover\:font-bold:hover {
        font-weight: 700;
      }
      @media (min-width: 768px) {
        .md\:font-bold {
          font-weight: 700;
        }
      }
      .foo {
        color: #000;
      }
    `)
  })
})
