import { run, html, css } from './util/run'

test('custom user-land utilities', () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="uppercase focus:hover:align-chocolate align-banana hover:align-banana"
        ></div>`,
      },
    ],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let input = css`
    @layer utilities {
      .align-banana {
        text-align: banana;
      }
    }

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer utilities {
      .align-chocolate {
        text-align: chocolate;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .uppercase {
        text-transform: uppercase;
      }
      .align-banana {
        text-align: banana;
      }
      .hover\\:align-banana:hover {
        text-align: banana;
      }
      .focus\\:hover\\:align-chocolate:focus:hover {
        text-align: chocolate;
      }
    `)
  })
})
