import { run, html, css } from '../util/run'

// TODO:
// - What should the defaults be in the config?

test('size utilities can be overridden with width/height utilities', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="size-4 w-6"></div>
          <div class="size-6 h-5"></div>
        `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .size-4 {
        width: 1rem;
        height: 1rem;
      }
      .size-6 {
        width: 1.5rem;
        height: 1.5rem;
      }
      .h-5 {
        height: 1.25rem;
      }
      .w-6 {
        width: 1.5rem;
      }
    `)
  })
})

test('size utilities can be configured with separate width/height values', () => {
  let config = {
    content: [
      {
        raw: html` <div class="size-screen"></div> `,
      },
    ],
    theme: {
      size: {
        screen: ['100vw', '100vh'],
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .size-screen {
        width: 100vw;
        height: 100vh;
      }
    `)
  })
})
