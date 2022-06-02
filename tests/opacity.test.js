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

it('can use <alpha-value> defining custom properties for colors (opacity plugins enabled)', () => {
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
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
      },
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
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
      },
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
      colors: {
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
      },
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
      colors: {
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
      },
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

test('Theme function in JS can apply alpha values to colors (1)', () => {
  let input = css`
    @tailwind utilities;
  `

  let output = css`
    .text-foo {
      color: rgb(59 130 246 / 50%);
    }
  `

  return run(input, {
    content: [{ raw: html`text-foo` }],
    corePlugins: { textOpacity: false },
    theme: {
      colors: { blue: { 500: '#3b82f6' } },
      extend: {
        textColor: ({ theme }) => ({
          foo: theme('colors.blue.500 / 50%'),
        }),
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function in JS can apply alpha values to colors (2)', () => {
  let input = css`
    @tailwind utilities;
  `

  let output = css`
    .text-foo {
      color: rgb(59 130 246 / 0.5);
    }
  `

  return run(input, {
    content: [{ raw: html`text-foo` }],
    corePlugins: { textOpacity: false },
    theme: {
      colors: { blue: { 500: '#3b82f6' } },
      extend: {
        textColor: ({ theme }) => ({
          foo: theme('colors.blue.500 / 0.5'),
        }),
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function in JS can apply alpha values to colors (3)', () => {
  let input = css`
    @tailwind utilities;
  `

  let output = css`
    .text-foo {
      color: rgb(59 130 246 / var(--my-alpha));
    }
  `

  return run(input, {
    content: [{ raw: html`text-foo` }],
    corePlugins: { textOpacity: false },
    theme: {
      colors: { blue: { 500: '#3b82f6' } },
      extend: {
        textColor: ({ theme }) => ({
          foo: theme('colors.blue.500 / var(--my-alpha)'),
        }),
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function in JS can apply alpha values to colors (4)', () => {
  let input = css`
    @tailwind utilities;
  `

  let output = css`
    .text-foo {
      color: hsl(217 91% 60% / 50%);
    }
  `

  return run(input, {
    content: [{ raw: html`text-foo` }],
    corePlugins: { textOpacity: false },
    theme: {
      colors: { blue: { 500: 'hsl(217, 91%, 60%)' } },
      extend: {
        textColor: ({ theme }) => ({
          foo: theme('colors.blue.500 / 50%'),
        }),
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function in JS can apply alpha values to colors (5)', () => {
  let input = css`
    @tailwind utilities;
  `

  let output = css`
    .text-foo {
      color: hsl(217 91% 60% / 0.5);
    }
  `

  return run(input, {
    content: [{ raw: html`text-foo` }],
    corePlugins: { textOpacity: false },
    theme: {
      colors: { blue: { 500: 'hsl(217, 91%, 60%)' } },
      extend: {
        textColor: ({ theme }) => ({
          foo: theme('colors.blue.500 / 0.5'),
        }),
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function in JS can apply alpha values to colors (6)', () => {
  let input = css`
    @tailwind utilities;
  `

  let output = css`
    .text-foo {
      color: hsl(217 91% 60% / var(--my-alpha));
    }
  `

  return run(input, {
    content: [{ raw: html`text-foo` }],
    corePlugins: { textOpacity: false },
    theme: {
      colors: { blue: { 500: 'hsl(217, 91%, 60%)' } },
      extend: {
        textColor: ({ theme }) => ({
          foo: theme('colors.blue.500 / var(--my-alpha)'),
        }),
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function in JS can apply alpha values to colors (7)', () => {
  let input = css`
    @tailwind utilities;
  `

  let output = css`
    .text-foo {
      color: rgb(var(--foo) / var(--my-alpha));
    }
  `

  return run(input, {
    content: [{ raw: html`text-foo` }],
    corePlugins: { textOpacity: false },
    theme: {
      colors: {
        blue: {
          500: 'rgb(var(--foo) / <alpha-value>)',
        },
      },
      extend: {
        textColor: ({ theme }) => ({
          foo: theme('colors.blue.500 / var(--my-alpha)'),
        }),
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function prefers existing values in config', () => {
  let input = css`
    @tailwind utilities;
  `

  let output = css`
    .text-foo {
      color: purple;
    }
  `

  return run(input, {
    content: [{ raw: html`text-foo` }],
    corePlugins: { textOpacity: false },
    theme: {
      colors: {
        blue: {
          '500 / 50%': 'purple',
        },
      },
      extend: {
        textColor: ({ theme }) => ({
          foo: theme('colors.blue.500 / 50%'),
        }),
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

it('should be possible to use an <alpha-value> as part of the color definition', () => {
  let config = {
    content: [
      {
        raw: html` <div class="bg-primary"></div> `,
      },
    ],
    corePlugins: ['backgroundColor', 'backgroundOpacity'],
    theme: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .bg-primary {
        --tw-bg-opacity: 1;
        background-color: rgb(var(--color-primary) / var(--tw-bg-opacity));
      }
    `)
  })
})

it('should be possible to use an <alpha-value> as part of the color definition with an opacity modifiers', () => {
  let config = {
    content: [
      {
        raw: html` <div class="bg-primary/50"></div> `,
      },
    ],
    corePlugins: ['backgroundColor', 'backgroundOpacity'],
    theme: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .bg-primary\/50 {
        background-color: rgb(var(--color-primary) / 0.5);
      }
    `)
  })
})

it('should be possible to use an <alpha-value> as part of the color definition with an opacity modifiers', () => {
  let config = {
    content: [
      {
        raw: html` <div class="bg-primary"></div> `,
      },
    ],
    corePlugins: ['backgroundColor'],
    theme: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .bg-primary {
        background-color: rgb(var(--color-primary) / 1);
      }
    `)
  })
})

it('should be possible to use <alpha-value> inside arbitrary values', () => {
  let config = {
    content: [
      {
        raw: html` <div class="bg-[rgb(var(--color-primary)/<alpha-value>)]/50"></div> `,
      },
    ],
    corePlugins: ['backgroundColor', 'backgroundOpacity'],
    theme: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .bg-\[rgb\(var\(--color-primary\)\/\<alpha-value\>\)\]\/50 {
        background-color: rgb(var(--color-primary) / 0.5);
      }
    `)
  })
})
