import { run, html, css } from './util/run'

test('basic color opacity modifier', async () => {
  let config = {
    content: [{ raw: html`<div class="bg-red-500/50"></div>` }],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-red-500\/50 {
        background-color: #ef444480;
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
      .bg-red-500\/50 {
        --tw-bg-opacity: 1;
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
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
      .bg-red-500\/\[var\(--opacity\)\] {
        background-color: rgb(239 68 68 / var(--opacity));
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

test('arbitrary color with opacity from scale', async () => {
  let config = {
    content: [{ raw: 'bg-[wheat]/50' }],
    theme: {},
    plugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-\[wheat\]\/50 {
        background-color: #f5deb380;
      }
    `)
  })
})

test('arbitrary color with arbitrary opacity', async () => {
  let config = {
    content: [{ raw: 'bg-[#bada55]/[0.2]' }],
    theme: {},
    plugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-\[\#bada55\]\/\[0\.2\] {
        background-color: #bada5533;
      }
    `)
  })
})

test('undefined theme color with opacity from scale', async () => {
  let config = {
    content: [{ raw: 'bg-garbage/50' }],
    theme: {},
    plugins: [],
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
      .bg-blue\/50 {
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
      .from-red-500\/50 {
        --tw-gradient-from: #ef444480 var(--tw-gradient-from-position);
        --tw-gradient-to: #ef444400 var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .fill-red-500\/25 {
        fill: #ef444440;
      }
      .placeholder-red-500\/75::placeholder {
        color: #ef4444bf;
      }
    `)
  })
})

test('opacity modifier in combination with partial custom properties', async () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="bg-[hsl(var(--foo),50%,50%)]"></div>
          <div class="bg-[hsl(123,var(--foo),50%)]"></div>
          <div class="bg-[hsl(123,50%,var(--foo))]"></div>
          <div class="bg-[hsl(var(--foo),50%,50%)]/50"></div>
          <div class="bg-[hsl(123,var(--foo),50%)]/50"></div>
          <div class="bg-[hsl(123,50%,var(--foo))]/50"></div>
          <div class="bg-[hsl(var(--foo),var(--bar),var(--baz))]/50"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-\[hsl\(123\,50\%\,var\(--foo\)\)\] {
        --tw-bg-opacity: 1;
        background-color: hsl(123 50% var(--foo) / var(--tw-bg-opacity));
      }
      .bg-\[hsl\(123\,50\%\,var\(--foo\)\)\]\/50 {
        background-color: hsl(123 50% var(--foo) / 0.5);
      }
      .bg-\[hsl\(123\,var\(--foo\)\,50\%\)\] {
        --tw-bg-opacity: 1;
        background-color: hsl(123 var(--foo) 50% / var(--tw-bg-opacity));
      }
      .bg-\[hsl\(123\,var\(--foo\)\,50\%\)\]\/50 {
        background-color: hsl(123 var(--foo) 50% / 0.5);
      }
      .bg-\[hsl\(var\(--foo\)\,50\%\,50\%\)\] {
        --tw-bg-opacity: 1;
        background-color: hsl(var(--foo) 50% 50% / var(--tw-bg-opacity));
      }
      .bg-\[hsl\(var\(--foo\)\,50\%\,50\%\)\]\/50 {
        background-color: hsl(var(--foo) 50% 50% / 0.5);
      }
      .bg-\[hsl\(var\(--foo\)\,var\(--bar\)\,var\(--baz\)\)\]\/50 {
        background-color: hsl(var(--foo) var(--bar) var(--baz) / 0.5);
      }
    `)
  })
})
