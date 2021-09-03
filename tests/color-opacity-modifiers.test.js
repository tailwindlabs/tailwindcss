import { run, css, html } from './util/run'

test('basic color opacity modifier', async () => {
  let config = {
    content: [{ raw: html`<div class="bg-red-500/50"></div>` }],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-red-500\\/50 {
        background-color: rgba(239, 68, 68, 0.5);
      }
    `)
  })
})

test('colors with slashes are matched first', async () => {
  let config = {
    content: [{ raw: html`<div class="bg-red-500/50"></div>` }],
    theme: {
      extend: {
        colors: {
          'red-500/50': '#ff0000',
        },
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-red-500\\/50 {
        --tw-bg-opacity: 1;
        background-color: rgba(255, 0, 0, var(--tw-bg-opacity));
      }
    `)
  })
})

test('arbitrary color opacity modifier', async () => {
  let config = {
    content: [{ raw: html`<div class="bg-red-500/[var(--opacity)]"></div>` }],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-red-500\\/\\[var\\(--opacity\\)\\] {
        background-color: rgba(239, 68, 68, var(--opacity));
      }
    `)
  })
})

test('missing alpha generates nothing', async () => {
  let config = {
    content: [{ raw: html`<div class="bg-red-500/"></div>` }],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(``)
  })
})

test('values not in the opacity config are ignored', async () => {
  let config = {
    content: [{ raw: html`<div class="bg-red-500/29"></div>` }],
    theme: {
      opacity: {
        0: '0',
        25: '0.25',
        5: '0.5',
        75: '0.75',
        100: '1',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(``)
  })
})

test('function colors are supported', async () => {
  let config = {
    content: [{ raw: html`<div class="bg-blue/50"></div>` }],
    theme: {
      colors: {
        blue: ({ opacityValue }) => {
          return `rgba(var(--colors-blue), ${opacityValue})`
        },
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-blue\\/50 {
        background-color: rgba(var(--colors-blue), 0.5);
      }
    `)
  })
})

test('utilities that support any type are supported', async () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="from-red-500/50"></div>
          <div class="fill-red-500/25"></div>
          <div class="placeholder-red-500/75"></div>
        `,
      },
    ],
    theme: {
      extend: {
        fill: (theme) => theme('colors'),
      },
    },
    plugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .from-red-500\\/50 {
        --tw-gradient-from: rgba(239, 68, 68, 0.5);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(239, 68, 68, 0));
      }
      .fill-red-500\\/25 {
        fill: rgba(239, 68, 68, 0.25);
      }
      .placeholder-red-500\\/75::placeholder {
        color: rgba(239, 68, 68, 0.75);
      }
    `)
  })
})
