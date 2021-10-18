import { run, html, css } from './util/run'

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
      .dark .dark\:font-bold {
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
      @media (prefers-color-scheme: dark) {
        .dark\:font-bold {
          font-weight: 700;
        }
      }
    `)
  })
})
