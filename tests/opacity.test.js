import { run, html, css } from './util/run'

test('opacity', () => {
  let config = {
    darkMode: 'class',
    content: [
      {
        raw: html`
          <div class="divide-black"></div>
          <div class="border-black"></div>
          <div class="bg-black"></div>
          <div class="text-black"></div>
          <div class="placeholder-black"></div>
        `,
      },
    ],
    corePlugins: {
      backgroundOpacity: false,
      borderOpacity: false,
      divideOpacity: false,
      placeholderOpacity: false,
      textOpacity: false,
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .divide-black > :not([hidden]) ~ :not([hidden]) {
        border-color: #000;
      }
      .border-black {
        border-color: #000;
      }
      .bg-black {
        background-color: #000;
      }
      .text-black {
        color: #000;
      }
      .placeholder-black::placeholder {
        color: #000;
      }
    `)
  })
})

test('colors defined as functions work when opacity plugins are disabled', () => {
  let config = {
    darkMode: 'class',
    content: [
      {
        raw: html`
          <div class="divide-primary"></div>
          <div class="border-primary"></div>
          <div class="bg-primary"></div>
          <div class="text-primary"></div>
          <div class="placeholder-primary"></div>
        `,
      },
    ],
    theme: {
      colors: {
        primary: ({ opacityValue }) =>
          opacityValue === undefined
            ? 'rgb(var(--color-primary))'
            : `rgb(var(--color-primary) / ${opacityValue})`,
      },
    },
    corePlugins: {
      backgroundOpacity: false,
      borderOpacity: false,
      divideOpacity: false,
      placeholderOpacity: false,
      textOpacity: false,
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .divide-primary > :not([hidden]) ~ :not([hidden]) {
        border-color: rgb(var(--color-primary));
      }
      .border-primary {
        border-color: rgb(var(--color-primary));
      }
      .bg-primary {
        background-color: rgb(var(--color-primary));
      }
      .text-primary {
        color: rgb(var(--color-primary));
      }
      .placeholder-primary::placeholder {
        color: rgb(var(--color-primary));
      }
    `)
  })
})
