import { run, html, css, defaults } from './util/run'

it('should generate the partial selector, if only a partial is used (base layer)', () => {
  let config = {
    content: [{ raw: html`<div></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;

    @layer base {
      :root {
        font-weight: bold;
      }

      /* --- */

      :root,
      .a {
        color: black;
      }
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      :root {
        font-weight: bold;
      }

      /* --- */

      :root,
      .a {
        color: black;
      }

      ${defaults}
    `)
  })
})

it('should generate the partial selector, if only a partial is used (utilities layer)', () => {
  let config = {
    content: [{ raw: html`<div class="a"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      :root {
        font-weight: bold;
      }

      /* --- */

      :root,
      .a {
        color: black;
      }
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      :root {
        font-weight: bold;
      }

      /* --- */

      :root,
      .a {
        color: black;
      }
    `)
  })
})
