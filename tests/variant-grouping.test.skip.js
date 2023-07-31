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
    experimental: { variantGrouping: true, oxideParser: false },
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
        .md\:\(underline\,italic\) {
          font-style: italic;
          text-decoration-line: underline;
        }
      }
    `)
  })
})

it('should be possible to group using constrained and arbitrary variants together', () => {
  let config = {
    experimental: { variantGrouping: true, oxideParser: false },
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
          .dark\:\[\@supports\(hover\:hover\)\]\:hover\:\[\&\>\*\]\:\(\[--potato\:baked\]\,bg-\[\#0088cc\]\)
            > :hover {
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
    experimental: { variantGrouping: true, oxideParser: false },
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
          .md\:dark\:\(underline\,italic\) {
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
    experimental: { variantGrouping: true, oxideParser: false },
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
        .md\:\(underline\,italic\,hover\:\(uppercase\,font-bold\)\) {
          font-style: italic;
          text-decoration-line: underline;
        }
        .md\:\(underline\,italic\,hover\:\(uppercase\,font-bold\)\):hover {
          text-transform: uppercase;
          font-weight: 700;
        }
      }
    `)
  })
})

it('should be possible to use nested multiple grouped variants', () => {
  let config = {
    experimental: { variantGrouping: true, oxideParser: false },
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
        .md\:\(text-black\,dark\:\(text-white\,hover\:focus\:text-gray-100\)\) {
          --tw-text-opacity: 1;
          color: rgb(0 0 0 / var(--tw-text-opacity));
        }
        @media (prefers-color-scheme: dark) {
          .md\:\(text-black\,dark\:\(text-white\,hover\:focus\:text-gray-100\)\) {
            --tw-text-opacity: 1;
            color: rgb(255 255 255 / var(--tw-text-opacity));
          }
          .md\:\(text-black\,dark\:\(text-white\,hover\:focus\:text-gray-100\)\):focus:hover {
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
    experimental: { variantGrouping: true, oxideParser: false },
    content: [
      {
        raw: html`<div
          class="md:[&>*]:(text-black,dark:(text-white,hover:[@supports(color:green)]:[&:nth-child(2n+1)]:text-gray-100))"
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
        .md\:\[\&\>\*\]\:\(text-black\,dark\:\(text-white\,hover\:\[\@supports\(color\:green\)\]\:\[\&\:nth-child\(2n\+1\)\]\:text-gray-100\)\)
          > * {
          --tw-text-opacity: 1;
          color: rgb(0 0 0 / var(--tw-text-opacity));
        }
        @media (prefers-color-scheme: dark) {
          .md\:\[\&\>\*\]\:\(text-black\,dark\:\(text-white\,hover\:\[\@supports\(color\:green\)\]\:\[\&\:nth-child\(2n\+1\)\]\:text-gray-100\)\)
            > * {
            --tw-text-opacity: 1;
            color: rgb(255 255 255 / var(--tw-text-opacity));
          }
          @supports (color: green) {
            .md\:\[\&\>\*\]\:\(text-black\,dark\:\(text-white\,hover\:\[\@supports\(color\:green\)\]\:\[\&\:nth-child\(2n\+1\)\]\:text-gray-100\)\):nth-child(
                odd
              ):hover
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
    experimental: { variantGrouping: true, oxideParser: false },
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
      .ui-active\:\(bg-black\,text-white\)[data-ui-state~='active'],
      [data-ui-state~='active'] .ui-active\:\(bg-black\,text-white\) {
        --tw-bg-opacity: 1;
        background-color: rgb(0 0 0 / var(--tw-bg-opacity));
        --tw-text-opacity: 1;
        color: rgb(255 255 255 / var(--tw-text-opacity));
      }
      .ui-selected\:\(bg-indigo-500\,underline\)[data-ui-state~='selected'],
      [data-ui-state~='selected'] .ui-selected\:\(bg-indigo-500\,underline\) {
        --tw-bg-opacity: 1;
        background-color: rgb(99 102 241 / var(--tw-bg-opacity));
        text-decoration-line: underline;
      }
    `)
  })
})
