import { run, html, css, quickPluginTest } from '../util/run'

quickPluginTest('fontFamily').toMatchFormattedCss(css`
  .font-mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New,
      monospace;
  }
  .font-sans {
    font-family: ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans,
      sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  }
  .font-serif {
    font-family: ui-serif, Georgia, Cambria, Times New Roman, Times, serif;
  }
`)

test('font-family utilities can be defined as a string', () => {
  let config = {
    content: [{ raw: html`<div class="font-sans"></div>` }],
    theme: {
      fontFamily: {
        sans: 'Helvetica, Arial, sans-serif',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .font-sans {
        font-family: Helvetica, Arial, sans-serif;
      }
    `)
  })
})

test('font-family utilities can be defined as an array', () => {
  let config = {
    content: [{ raw: html`<div class="font-sans"></div>` }],
    theme: {
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .font-sans {
        font-family: Helvetica, Arial, sans-serif;
      }
    `)
  })
})

test('font-family values are not automatically escaped', () => {
  let config = {
    content: [{ raw: html`<div class="font-sans"></div>` }],
    theme: {
      fontFamily: {
        sans: ["'Exo 2'", 'sans-serif'],
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .font-sans {
        font-family: 'Exo 2', sans-serif;
      }
    `)
  })
})

test('font-feature-settings can be provided when families are defined as a string', () => {
  let config = {
    content: [{ raw: html`<div class="font-sans"></div>` }],
    theme: {
      fontFamily: {
        sans: ['Helvetica, Arial, sans-serif', { fontFeatureSettings: '"cv11", "ss01"' }],
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .font-sans {
        font-feature-settings: 'cv11', 'ss01';
        font-family: Helvetica, Arial, sans-serif;
      }
    `)
  })
})

test('font-feature-settings can be provided when families are defined as an array', () => {
  let config = {
    content: [{ raw: html`<div class="font-sans"></div>` }],
    theme: {
      fontFamily: {
        sans: [['Helvetica', 'Arial', 'sans-serif'], { fontFeatureSettings: '"cv11", "ss01"' }],
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .font-sans {
        font-feature-settings: 'cv11', 'ss01';
        font-family: Helvetica, Arial, sans-serif;
      }
    `)
  })
})

test('font-variation-settings can be provided when families are defined as a string', () => {
  let config = {
    content: [{ raw: html`<div class="font-sans"></div>` }],
    theme: {
      fontFamily: {
        sans: ['Inter, sans-serif', { fontVariationSettings: '"opsz" 32' }],
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .font-sans {
        font-variation-settings: 'opsz' 32;
        font-family: Inter, sans-serif;
      }
    `)
  })
})

test('font-variation-settings can be provided when families are defined as an array', () => {
  let config = {
    content: [{ raw: html`<div class="font-sans"></div>` }],
    theme: {
      fontFamily: {
        sans: [['Inter', 'sans-serif'], { fontVariationSettings: '"opsz" 32' }],
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .font-sans {
        font-variation-settings: 'opsz' 32;
        font-family: Inter, sans-serif;
      }
    `)
  })
})
