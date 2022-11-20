import { run, html, css } from '../util/run'

// TODO:
// - What should the defaults be in the config?
// - Should modifiers pull from `box` or `height`?
// - What should `box-screen/4` do?

test('box utilities can be overridden with width/height utilities', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="box-4 w-6"></div>
          <div class="box-6 h-5"></div>
        `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .box-4 {
        width: 1rem;
        height: 1rem;
      }
      .box-6 {
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

test('box utilities can be configured with separate width/height values', () => {
  let config = {
    content: [
      {
        raw: html` <div class="box-screen"></div> `,
      },
    ],
    theme: {
      box: {
        screen: ['100vw', '100vh'],
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .box-screen {
        width: 100vw;
        height: 100vh;
      }
    `)
  })
})

test('modifier can be used to set a height', () => {
  let config = {
    content: [
      {
        raw: html` <div class="box-[16px]/[24px]"></div> `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .box-\[16px\]\/\[24px\] {
        width: 16px;
        height: 24px;
      }
    `)
  })
})
