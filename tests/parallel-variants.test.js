import { run, html, css } from './util/run'

test('basic parallel variants', async () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="font-normal hover:test:font-black test:font-bold test:font-medium"
        ></div>`,
      },
    ],
    plugins: [
      function test({ addVariant }) {
        addVariant('test', ['& *::test', '&::test'])
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .font-normal {
        font-weight: 400;
      }
      .test\:font-bold *::test {
        font-weight: 700;
      }
      .test\:font-medium *::test {
        font-weight: 500;
      }
      .hover\:test\:font-black *:hover::test {
        font-weight: 900;
      }
      .test\:font-bold::test {
        font-weight: 700;
      }
      .test\:font-medium::test {
        font-weight: 500;
      }
      .hover\:test\:font-black:hover::test {
        font-weight: 900;
      }
    `)
  })
})
