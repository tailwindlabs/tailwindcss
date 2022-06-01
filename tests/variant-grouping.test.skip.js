import { run, html, css } from './util/run'

// TODO: Remove this once we enable this by default
it('should not generate nested selectors if the feature flag is not enabled', () => {
  let config = {
    content: [{ raw: html`<div class="md:(underline,italic)"></div>` }],
    corePlugins: { preflight: false },
    plugins: [],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .italic {
        font-style: italic;
      }

      .underline {
        text-decoration-line: underline;
      }
    `)
  })
})

it('should be possible to group variants', () => {
  let config = {
    experimental: 'all',
    content: [{ raw: html`<div class="md:(underline,italic)"></div>` }],
    corePlugins: { preflight: false },
    plugins: [],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 768px) {
        .md\:\(underline\2c italic\) {
          font-style: italic;
          text-decoration-line: underline;
        }
      }
    `)
  })
})

it('should be possible to group using constrained and arbitrary variants together', () => {
  let config = {
    experimental: 'all',
    content: [
      {
        raw: html`<div
          class="dark:[@supports(hover:hover)]:hover:[&>*]:([--potato:baked],bg-[#0088cc])"
        ></div>`,
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
      @media (prefers-color-scheme: dark) {
        @supports (hover: hover) {
          .dark\:\[\@supports\(hover\:hover\)\]\:hover\:\[\&\>\*\]\:\(\[--potato\:baked\]\2c
            bg-\[\#0088cc\]\)
            > *:hover {
            --tw-bg-opacity: 1;
            background-color: rgb(0 136 204 / var(--tw-bg-opacity));
            --potato: baked;
          }
        }
      }
    `)
  })
})

it('should be possible to group multiple variants', () => {
  let config = {
    experimental: 'all',
    content: [{ raw: html`<div class="md:dark:(underline,italic)"></div>` }],
    corePlugins: { preflight: false },
    plugins: [],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 768px) {
        @media (prefers-color-scheme: dark) {
          .md\:dark\:\(underline\2c italic\) {
            font-style: italic;
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

it('should be possible to group nested grouped variants', () => {
  let config = {
    experimental: 'all',
    content: [{ raw: html`<div class="md:(underline,italic,hover:(uppercase,font-bold))"></div>` }],
    corePlugins: { preflight: false },
    plugins: [],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 768px) {
        .md\:\(underline\2c italic\2c hover\:\(uppercase\2c font-bold\)\) {
          font-style: italic;
          text-decoration-line: underline;
        }

        .md\:\(underline\2c italic\2c hover\:\(uppercase\2c font-bold\)\):hover {
          font-weight: 700;
          text-transform: uppercase;
        }
      }
    `)
  })
})

it('should be possible to use nested multiple grouped variants', () => {
  let config = {
    experimental: 'all',
    content: [
      {
        raw: html`<div class="md:(text-black,dark:(text-white,hover:focus:text-gray-100))"></div>`,
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
      @media (min-width: 768px) {
        .md\:\(text-black\2c dark\:\(text-white\2c hover\:focus\:text-gray-100\)\) {
          --tw-text-opacity: 1;
          color: rgb(0 0 0 / var(--tw-text-opacity));
        }

        @media (prefers-color-scheme: dark) {
          .md\:\(text-black\2c dark\:\(text-white\2c hover\:focus\:text-gray-100\)\) {
            --tw-text-opacity: 1;
            color: rgb(255 255 255 / var(--tw-text-opacity));
          }
          .md\:\(text-black\2c dark\:\(text-white\2c hover\:focus\:text-gray-100\)\):focus:hover {
            --tw-text-opacity: 1;
            color: rgb(243 244 246 / var(--tw-text-opacity));
          }
        }
      }
    `)
  })
})

it('should be possible to mix and match nesting and different variant combinations', () => {
  let config = {
    experimental: 'all',
    content: [
      {
        raw: html`<div
          class="md:[&>*]:(text-black,dark:(text-white,hover:[@supports(color:green)]:[&:nth-child(2n=1)]:text-gray-100))"
        ></div>`,
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
      @media (min-width: 768px) {
        .md\:\[\&\>\*\]\:\(text-black\2c
          dark\:\(text-white\2c
          hover\:\[\@supports\(color\:green\)\]\:\[\&\:nth-child\(2n\=1\)\]\:text-gray-100\)\)
          > * {
          --tw-text-opacity: 1;
          color: rgb(0 0 0 / var(--tw-text-opacity));
        }
        @media (prefers-color-scheme: dark) {
          .md\:\[\&\>\*\]\:\(text-black\2c
            dark\:\(text-white\2c
            hover\:\[\@supports\(color\:green\)\]\:\[\&\:nth-child\(2n\=1\)\]\:text-gray-100\)\)
            > * {
            --tw-text-opacity: 1;
            color: rgb(255 255 255 / var(--tw-text-opacity));
          }
          @supports (color: green) {
            .md\:\[\&\>\*\]\:\(text-black\2c
              dark\:\(text-white\2c
              hover\:\[\@supports\(color\:green\)\]\:\[\&\:nth-child\(2n\=1\)\]\:text-gray-100\)\):nth-child(2n=1):hover
              > * {
              --tw-text-opacity: 1;
              color: rgb(243 244 246 / var(--tw-text-opacity));
            }
          }
        }
      }
    `)
  })
})

it('should group with variants defined in external plugins', () => {
  let config = {
    experimental: 'all',
    content: [
      {
        raw: html`
          <div class="ui-active:(bg-black,text-white) ui-selected:(bg-indigo-500,underline)"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ addVariant }) => {
        addVariant('ui-active', ['&[data-ui-state~="active"]', '[data-ui-state~="active"] &'])
        addVariant('ui-selected', ['&[data-ui-state~="selected"]', '[data-ui-state~="selected"] &'])
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .ui-active\:\(bg-black\2c text-white\)[data-ui-state~='active'] {
        --tw-bg-opacity: 1;
        background-color: rgb(0 0 0 / var(--tw-bg-opacity));
        --tw-text-opacity: 1;
        color: rgb(255 255 255 / var(--tw-text-opacity));
      }

      [data-ui-state~='active'] .ui-active\:\(bg-black\2c text-white\) {
        --tw-bg-opacity: 1;
        background-color: rgb(0 0 0 / var(--tw-bg-opacity));
        --tw-text-opacity: 1;
        color: rgb(255 255 255 / var(--tw-text-opacity));
      }

      .ui-selected\:\(bg-indigo-500\2c underline\)[data-ui-state~='selected'] {
        --tw-bg-opacity: 1;
        background-color: rgb(99 102 241 / var(--tw-bg-opacity));
        text-decoration-line: underline;
      }

      [data-ui-state~='selected'] .ui-selected\:\(bg-indigo-500\2c underline\) {
        --tw-bg-opacity: 1;
        background-color: rgb(99 102 241 / var(--tw-bg-opacity));
        text-decoration-line: underline;
      }
    `)
  })
})
