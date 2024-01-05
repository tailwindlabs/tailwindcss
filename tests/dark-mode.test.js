import { crosscheck, run, html, css, defaults } from './util/run'

crosscheck(({ oxide, stable }) => {
  it('should be possible to use the darkMode "class" mode', () => {
    let config = {
      darkMode: 'class',
      content: [{ raw: html`<div class="dark:font-bold"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        ${defaults}
        :is(.dark .dark\:font-bold) {
          font-weight: 700;
        }
      `)
    })
  })

  it('should be possible to change the class name', () => {
    let config = {
      darkMode: ['class', '.test-dark'],
      content: [{ raw: html`<div class="dark:font-bold"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        ${defaults}
        :is(.test-dark .dark\:font-bold) {
          font-weight: 700;
        }
      `)
    })
  })

  it('should be possible to use the darkMode "media" mode', () => {
    let config = {
      darkMode: 'media',
      content: [{ raw: html`<div class="dark:font-bold"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        ${defaults}
        @media (prefers-color-scheme: dark) {
          .dark\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })

  it('should default to the `media` mode when no mode is provided', () => {
    let config = {
      content: [{ raw: html`<div class="dark:font-bold"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        ${defaults}
        @media (prefers-color-scheme: dark) {
          .dark\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })

  it('should default to the `media` mode when mode is set to `false`', () => {
    let config = {
      darkMode: false,
      content: [{ raw: html`<div class="dark:font-bold"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        ${defaults}
        @media (prefers-color-scheme: dark) {
          .dark\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })

  it('should support the deprecated `class` dark mode behavior', () => {
    let config = {
      darkMode: 'class',
      content: [{ raw: html`<div class="dark:font-bold"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        :is(.dark .dark\:font-bold) {
          font-weight: 700;
        }
      `)
    })
  })

  it('should support custom classes with  deprecated `class` dark mode', () => {
    let config = {
      darkMode: ['class', '.my-dark'],
      content: [{ raw: html`<div class="dark:font-bold"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        :is(.my-dark .dark\:font-bold) {
          font-weight: 700;
        }
      `)
    })
  })

  it('should use legacy sorting when using `darkMode: class`', () => {
    let config = {
      darkMode: 'class',
      content: [
        {
          raw: html`<div class="dark:text-green-100 hover:text-green-200 lg:text-green-300"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      stable.expect(result.css).toMatchFormattedCss(css`
        .hover\:text-green-200:hover {
          --tw-text-opacity: 1;
          color: rgb(187 247 208 / var(--tw-text-opacity));
        }
        :is(.dark .dark\:text-green-100) {
          --tw-text-opacity: 1;
          color: rgb(220 252 231 / var(--tw-text-opacity));
        }
        @media (min-width: 1024px) {
          .lg\:text-green-300 {
            --tw-text-opacity: 1;
            color: rgb(134 239 172 / var(--tw-text-opacity));
          }
        }
      `)
      oxide.expect(result.css).toMatchFormattedCss(css`
        .hover\:text-green-200:hover {
          color: #bbf7d0;
        }
        :is(.dark .dark\:text-green-100) {
          color: #dcfce7;
        }
        @media (min-width: 1024px) {
          .lg\:text-green-300 {
            color: #86efac;
          }
        }
      `)
    })
  })

  it('should use modern sorting otherwise', () => {
    let config = {
      darkMode: 'selector',
      content: [
        {
          raw: html`<div class="dark:text-green-100 hover:text-green-200 lg:text-green-300"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      stable.expect(result.css).toMatchFormattedCss(css`
        .hover\:text-green-200:hover {
          --tw-text-opacity: 1;
          color: rgb(187 247 208 / var(--tw-text-opacity));
        }
        @media (min-width: 1024px) {
          .lg\:text-green-300 {
            --tw-text-opacity: 1;
            color: rgb(134 239 172 / var(--tw-text-opacity));
          }
        }
        .dark\:text-green-100:where(.dark, .dark *) {
          --tw-text-opacity: 1;
          color: rgb(220 252 231 / var(--tw-text-opacity));
        }
      `)
      oxide.expect(result.css).toMatchFormattedCss(css`
        .hover\:text-green-200:hover {
          color: #bbf7d0;
        }
        @media (min-width: 1024px) {
          .lg\:text-green-300 {
            color: #86efac;
          }
        }
        .dark\:text-green-100:where(.dark, .dark *) {
          color: #dcfce7;
        }
      `)
    })
  })

  it('should allow customization of the dark mode variant', () => {
    let config = {
      darkMode: ['variant', '&:not(.light *)'],
      content: [{ raw: html`<div class="dark:font-bold"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .dark\:font-bold:not(.light *) {
          font-weight: 700;
        }
      `)
    })
  })

  it('should support parallel selectors for the dark mode variant', () => {
    let config = {
      darkMode: ['variant', ['&:not(.light *)', '&:not(.extralight *)']],
      content: [{ raw: html`<div class="dark:font-bold"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .dark\:font-bold:not(.light *),
        .dark\:font-bold:not(.extralight *) {
          font-weight: 700;
        }
      `)
    })
  })

  it('should support fn selectors for the dark mode variant', () => {
    let config = {
      darkMode: ['variant', () => ['&:not(.light *)', '&:not(.extralight *)']],
      content: [{ raw: html`<div class="dark:font-bold"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .dark\:font-bold:not(.light *),
        .dark\:font-bold:not(.extralight *) {
          font-weight: 700;
        }
      `)
    })
  })
})
