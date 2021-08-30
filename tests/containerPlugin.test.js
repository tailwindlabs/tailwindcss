import path from 'path'
import postcss from 'postcss'

import tailwind from '../src/jit'

function run(input, config = {}) {
  return postcss(tailwind(config)).process(input, {
    from: path.resolve(__filename),
  })
}

function css(templates) {
  return templates.join('')
}

function html(templates) {
  return templates.join('')
}

test('options are not required', () => {
  let config = {
    mode: 'jit',
    purge: [{ raw: html`<div class="container"></div>` }],
  }

  let content = css`
    @tailwind components;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .container {
        width: 100%;
      }
      @media (min-width: 640px) {
        .container {
          max-width: 640px;
        }
      }
      @media (min-width: 768px) {
        .container {
          max-width: 768px;
        }
      }
      @media (min-width: 1024px) {
        .container {
          max-width: 1024px;
        }
      }
      @media (min-width: 1280px) {
        .container {
          max-width: 1280px;
        }
      }
      @media (min-width: 1536px) {
        .container {
          max-width: 1536px;
        }
      }
    `)
  })
})

test('screens can be passed explicitly', () => {
  let config = {
    mode: 'jit',
    purge: [{ raw: html`<div class="container"></div>` }],
    theme: {
      container: {
        screens: ['400px', '500px'],
      },
    },
  }

  let content = css`
    @tailwind components;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .container {
        width: 100%;
      }
      @media (min-width: 400px) {
        .container {
          max-width: 400px;
        }
      }
      @media (min-width: 500px) {
        .container {
          max-width: 500px;
        }
      }
    `)
  })
})

test('screens are ordered ascending by min-width', () => {
  let config = {
    mode: 'jit',
    purge: [{ raw: html`<div class="container"></div>` }],
    theme: {
      container: {
        screens: ['500px', '400px'],
      },
    },
  }

  let content = css`
    @tailwind components;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .container {
        width: 100%;
      }
      @media (min-width: 400px) {
        .container {
          max-width: 400px;
        }
      }
      @media (min-width: 500px) {
        .container {
          max-width: 500px;
        }
      }
    `)
  })
})

test('screens are deduplicated by min-width', () => {
  let config = {
    mode: 'jit',
    purge: [{ raw: html`<div class="container"></div>` }],
    theme: {
      container: {
        screens: {
          sm: '576px',
          md: '768px',
          'sm-only': { min: '576px', max: '767px' },
        },
      },
    },
  }

  let content = css`
    @tailwind components;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .container {
        width: 100%;
      }
      @media (min-width: 576px) {
        .container {
          max-width: 576px;
        }
      }
      @media (min-width: 768px) {
        .container {
          max-width: 768px;
        }
      }
    `)
  })
})

test('the container can be centered by default', () => {
  let config = {
    mode: 'jit',
    purge: [{ raw: html`<div class="container"></div>` }],
    theme: {
      container: {
        center: true,
      },
    },
  }

  let content = css`
    @tailwind components;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .container {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
      }
      @media (min-width: 640px) {
        .container {
          max-width: 640px;
        }
      }
      @media (min-width: 768px) {
        .container {
          max-width: 768px;
        }
      }
      @media (min-width: 1024px) {
        .container {
          max-width: 1024px;
        }
      }
      @media (min-width: 1280px) {
        .container {
          max-width: 1280px;
        }
      }
      @media (min-width: 1536px) {
        .container {
          max-width: 1536px;
        }
      }
    `)
  })
})

test('horizontal padding can be included by default', () => {
  let config = {
    mode: 'jit',
    purge: [{ raw: html`<div class="container"></div>` }],
    theme: {
      container: {
        padding: '2rem',
      },
    },
  }

  let content = css`
    @tailwind components;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .container {
        width: 100%;
        padding-right: 2rem;
        padding-left: 2rem;
      }
      @media (min-width: 640px) {
        .container {
          max-width: 640px;
        }
      }
      @media (min-width: 768px) {
        .container {
          max-width: 768px;
        }
      }
      @media (min-width: 1024px) {
        .container {
          max-width: 1024px;
        }
      }
      @media (min-width: 1280px) {
        .container {
          max-width: 1280px;
        }
      }
      @media (min-width: 1536px) {
        .container {
          max-width: 1536px;
        }
      }
    `)
  })
})

test('responsive horizontal padding can be included by default', () => {
  let config = {
    mode: 'jit',
    purge: [{ raw: html`<div class="container"></div>` }],
    theme: {
      screens: {
        sm: '576px',
        md: { min: '768px' },
        lg: { 'min-width': '992px' },
        xl: { min: '1200px', max: '1600px' },
      },
      container: {
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
    },
  }

  let content = css`
    @tailwind components;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .container {
        width: 100%;
        padding-right: 1rem;
        padding-left: 1rem;
      }
      @media (min-width: 576px) {
        .container {
          max-width: 576px;
          padding-right: 2rem;
          padding-left: 2rem;
        }
      }
      @media (min-width: 768px) {
        .container {
          max-width: 768px;
        }
      }
      @media (min-width: 992px) {
        .container {
          max-width: 992px;
          padding-right: 4rem;
          padding-left: 4rem;
        }
      }
      @media (min-width: 1200px) {
        .container {
          max-width: 1200px;
          padding-right: 5rem;
          padding-left: 5rem;
        }
      }
    `)
  })
})

test('setting all options at once', () => {
  let config = {
    mode: 'jit',
    purge: [{ raw: html`<div class="container"></div>` }],
    theme: {
      container: {
        screens: ['400px', '500px'],
        center: true,
        padding: '2rem',
      },
    },
  }

  let content = css`
    @tailwind components;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .container {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
        padding-right: 2rem;
        padding-left: 2rem;
      }
      @media (min-width: 400px) {
        .container {
          max-width: 400px;
        }
      }
      @media (min-width: 500px) {
        .container {
          max-width: 500px;
        }
      }
    `)
  })
})

test('container can use variants', () => {
  let config = {
    mode: 'jit',
    purge: [{ raw: html`<div class="lg:hover:container"></div>` }],
    theme: {
      container: {
        screens: ['400px', '500px'],
      },
    },
  }

  let content = css`
    @tailwind components;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 1024px) {
        .lg\\:hover\\:container:hover {
          width: 100%;
        }
        @media (min-width: 400px) {
          .lg\\:hover\\:container:hover {
            max-width: 400px;
          }
        }
        @media (min-width: 500px) {
          .lg\\:hover\\:container:hover {
            max-width: 500px;
          }
        }
      }
    `)
  })
})
