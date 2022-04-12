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

it('can use rgb helper when defining custom properties for colors (opacity plugins enabled)', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="divide-primary"></div>
          <div class="divide-primary divide-opacity-50"></div>
          <div class="border-primary"></div>
          <div class="border-primary border-opacity-50"></div>
          <div class="bg-primary"></div>
          <div class="bg-primary bg-opacity-50"></div>
          <div class="text-primary"></div>
          <div class="text-primary text-opacity-50"></div>
          <div class="placeholder-primary"></div>
          <div class="placeholder-primary placeholder-opacity-50"></div>
          <div class="ring-primary"></div>
          <div class="ring-primary ring-opacity-50"></div>
        `,
      },
    ],
    theme: {
      colors: ({ rgb }) => ({
        primary: rgb('--color-primary'),
      }),
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .divide-primary > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-opacity: 1;
        border-color: rgb(var(--color-primary) / var(--tw-divide-opacity));
      }
      .divide-opacity-50 > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-opacity: 0.5;
      }
      .border-primary {
        --tw-border-opacity: 1;
        border-color: rgb(var(--color-primary) / var(--tw-border-opacity));
      }
      .border-opacity-50 {
        --tw-border-opacity: 0.5;
      }
      .bg-primary {
        --tw-bg-opacity: 1;
        background-color: rgb(var(--color-primary) / var(--tw-bg-opacity));
      }
      .bg-opacity-50 {
        --tw-bg-opacity: 0.5;
      }
      .text-primary {
        --tw-text-opacity: 1;
        color: rgb(var(--color-primary) / var(--tw-text-opacity));
      }
      .text-opacity-50 {
        --tw-text-opacity: 0.5;
      }
      .placeholder-primary::placeholder {
        --tw-placeholder-opacity: 1;
        color: rgb(var(--color-primary) / var(--tw-placeholder-opacity));
      }
      .placeholder-opacity-50::placeholder {
        --tw-placeholder-opacity: 0.5;
      }
      .ring-primary {
        --tw-ring-opacity: 1;
        --tw-ring-color: rgb(var(--color-primary) / var(--tw-ring-opacity));
      }
      .ring-opacity-50 {
        --tw-ring-opacity: 0.5;
      }
    `)
  })
})

it('can use rgb helper when defining custom properties for colors (opacity plugins disabled)', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="divide-primary"></div>
          <div class="divide-primary/50"></div>
          <div class="border-primary"></div>
          <div class="border-primary/50"></div>
          <div class="bg-primary"></div>
          <div class="bg-primary/50"></div>
          <div class="text-primary"></div>
          <div class="text-primary/50"></div>
          <div class="placeholder-primary"></div>
          <div class="placeholder-primary/50"></div>
          <div class="ring-primary"></div>
          <div class="ring-primary/50"></div>
        `,
      },
    ],
    theme: {
      colors: ({ rgb }) => ({
        primary: rgb('--color-primary'),
      }),
    },
    corePlugins: {
      backgroundOpacity: false,
      borderOpacity: false,
      divideOpacity: false,
      placeholderOpacity: false,
      textOpacity: false,
      ringOpacity: false,
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .divide-primary > :not([hidden]) ~ :not([hidden]) {
        border-color: rgb(var(--color-primary) / 1);
      }
      .divide-primary\/50 > :not([hidden]) ~ :not([hidden]) {
        border-color: rgb(var(--color-primary) / 0.5);
      }
      .border-primary {
        border-color: rgb(var(--color-primary) / 1);
      }
      .border-primary\/50 {
        border-color: rgb(var(--color-primary) / 0.5);
      }
      .bg-primary {
        background-color: rgb(var(--color-primary) / 1);
      }
      .bg-primary\/50 {
        background-color: rgb(var(--color-primary) / 0.5);
      }
      .text-primary {
        color: rgb(var(--color-primary) / 1);
      }
      .text-primary\/50 {
        color: rgb(var(--color-primary) / 0.5);
      }
      .placeholder-primary::placeholder {
        color: rgb(var(--color-primary) / 1);
      }
      .placeholder-primary\/50::placeholder {
        color: rgb(var(--color-primary) / 0.5);
      }
      .ring-primary {
        --tw-ring-color: rgb(var(--color-primary) / 1);
      }
      .ring-primary\/50 {
        --tw-ring-color: rgb(var(--color-primary) / 0.5);
      }
    `)
  })
})

it('can use hsl helper when defining custom properties for colors (opacity plugins enabled)', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="divide-primary"></div>
          <div class="divide-primary divide-opacity-50"></div>
          <div class="border-primary"></div>
          <div class="border-primary border-opacity-50"></div>
          <div class="bg-primary"></div>
          <div class="bg-primary bg-opacity-50"></div>
          <div class="text-primary"></div>
          <div class="text-primary text-opacity-50"></div>
          <div class="placeholder-primary"></div>
          <div class="placeholder-primary placeholder-opacity-50"></div>
          <div class="ring-primary"></div>
          <div class="ring-primary ring-opacity-50"></div>
        `,
      },
    ],
    theme: {
      colors: ({ hsl }) => ({
        primary: hsl('--color-primary'),
      }),
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .divide-primary > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-opacity: 1;
        border-color: hsl(var(--color-primary) / var(--tw-divide-opacity));
      }
      .divide-opacity-50 > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-opacity: 0.5;
      }
      .border-primary {
        --tw-border-opacity: 1;
        border-color: hsl(var(--color-primary) / var(--tw-border-opacity));
      }
      .border-opacity-50 {
        --tw-border-opacity: 0.5;
      }
      .bg-primary {
        --tw-bg-opacity: 1;
        background-color: hsl(var(--color-primary) / var(--tw-bg-opacity));
      }
      .bg-opacity-50 {
        --tw-bg-opacity: 0.5;
      }
      .text-primary {
        --tw-text-opacity: 1;
        color: hsl(var(--color-primary) / var(--tw-text-opacity));
      }
      .text-opacity-50 {
        --tw-text-opacity: 0.5;
      }
      .placeholder-primary::placeholder {
        --tw-placeholder-opacity: 1;
        color: hsl(var(--color-primary) / var(--tw-placeholder-opacity));
      }
      .placeholder-opacity-50::placeholder {
        --tw-placeholder-opacity: 0.5;
      }
      .ring-primary {
        --tw-ring-opacity: 1;
        --tw-ring-color: hsl(var(--color-primary) / var(--tw-ring-opacity));
      }
      .ring-opacity-50 {
        --tw-ring-opacity: 0.5;
      }
    `)
  })
})

it('can use hsl helper when defining custom properties for colors (opacity plugins disabled)', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="divide-primary"></div>
          <div class="divide-primary/50"></div>
          <div class="border-primary"></div>
          <div class="border-primary/50"></div>
          <div class="bg-primary"></div>
          <div class="bg-primary/50"></div>
          <div class="text-primary"></div>
          <div class="text-primary/50"></div>
          <div class="placeholder-primary"></div>
          <div class="placeholder-primary/50"></div>
          <div class="ring-primary"></div>
          <div class="ring-primary/50"></div>
        `,
      },
    ],
    theme: {
      colors: ({ hsl }) => ({
        primary: hsl('--color-primary'),
      }),
    },
    corePlugins: {
      backgroundOpacity: false,
      borderOpacity: false,
      divideOpacity: false,
      placeholderOpacity: false,
      textOpacity: false,
      ringOpacity: false,
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .divide-primary > :not([hidden]) ~ :not([hidden]) {
        border-color: hsl(var(--color-primary) / 1);
      }
      .divide-primary\/50 > :not([hidden]) ~ :not([hidden]) {
        border-color: hsl(var(--color-primary) / 0.5);
      }
      .border-primary {
        border-color: hsl(var(--color-primary) / 1);
      }
      .border-primary\/50 {
        border-color: hsl(var(--color-primary) / 0.5);
      }
      .bg-primary {
        background-color: hsl(var(--color-primary) / 1);
      }
      .bg-primary\/50 {
        background-color: hsl(var(--color-primary) / 0.5);
      }
      .text-primary {
        color: hsl(var(--color-primary) / 1);
      }
      .text-primary\/50 {
        color: hsl(var(--color-primary) / 0.5);
      }
      .placeholder-primary::placeholder {
        color: hsl(var(--color-primary) / 1);
      }
      .placeholder-primary\/50::placeholder {
        color: hsl(var(--color-primary) / 0.5);
      }
      .ring-primary {
        --tw-ring-color: hsl(var(--color-primary) / 1);
      }
      .ring-primary\/50 {
        --tw-ring-color: hsl(var(--color-primary) / 0.5);
      }
    `)
  })
})

it('the rgb helper throws when not passing custom properties', () => {
  let config = {
    theme: {
      colors: ({ rgb }) => ({
        primary: rgb('anything else'),
      }),
    },
  }

  return expect(run('@tailwind utilities', config)).rejects.toThrow(
    'The rgb() helper requires a custom property name to be passed as the first argument.'
  )
})

it('the hsl helper throws when not passing custom properties', () => {
  let config = {
    theme: {
      colors: ({ hsl }) => ({
        primary: hsl('anything else'),
      }),
    },
  }

  return expect(run('@tailwind utilities', config)).rejects.toThrow(
    'The hsl() helper requires a custom property name to be passed as the first argument.'
  )
})
