import { run, html, css } from './util/run'

test('it does something', () => {
  let config = {
    darkMode: 'class',
    content: [
      {
        raw: html`
          <div class="text-black"></div>
          <div class="text-potato"></div>
        `,
      },
    ],
  }

  return run(
    css`
      @tailwind utilities;

      :theme {
        --colors-potato: #facade;
      }
    `,
    config
  ).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .text-black {
        --tw-text-opacity: 1;
        color: rgb(0 0 0 / var(--tw-text-opacity));
      }
      .text-potato {
        --tw-text-opacity: 1;
        color: rgb(250 202 222 / var(--tw-text-opacity));
      }
      :root {
        --colors-potato: #facade;
      }
    `)
  })
})
