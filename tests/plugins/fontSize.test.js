import postcss from 'postcss'
import path from 'path'
import tailwind from '../../src/index.js'

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

test('font-size utilities can include a default line-height', () => {
  const config = {
    purge: [{ raw: html`<div class="text-sm text-md text-lg"></div>` }],
    theme: {
      fontSize: {
        sm: '12px',
        md: ['16px', '24px'],
        lg: ['20px', '28px'],
      },
    },
    corePlugins: ['fontSize'],
    variants: {
      fontSize: [],
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .text-sm {
        font-size: 12px;
      }
      .text-md {
        font-size: 16px;
        line-height: 24px;
      }
      .text-lg {
        font-size: 20px;
        line-height: 28px;
      }
    `)
  })
})

test('font-size utilities can include a default letter-spacing', () => {
  const config = {
    purge: [{ raw: html`<div class="text-sm text-md text-lg"></div>` }],
    theme: {
      fontSize: {
        sm: '12px',
        md: ['16px', { letterSpacing: '-0.01em' }],
        lg: ['20px', { letterSpacing: '-0.02em' }],
      },
    },
    corePlugins: ['fontSize'],
    variants: {
      fontSize: [],
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .text-sm {
        font-size: 12px;
      }
      .text-md {
        font-size: 16px;
        letter-spacing: -0.01em;
      }
      .text-lg {
        font-size: 20px;
        letter-spacing: -0.02em;
      }
    `)
  })
})

test('font-size utilities can include a default line-height and letter-spacing', () => {
  const config = {
    purge: [{ raw: html`<div class="text-sm text-md text-lg"></div>` }],
    theme: {
      fontSize: {
        sm: '12px',
        md: ['16px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
        lg: ['20px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
      },
    },
    corePlugins: ['fontSize'],
    variants: {
      fontSize: [],
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .text-sm {
        font-size: 12px;
      }
      .text-md {
        font-size: 16px;
        line-height: 24px;
        letter-spacing: -0.01em;
      }
      .text-lg {
        font-size: 20px;
        line-height: 28px;
        letter-spacing: -0.02em;
      }
    `)
  })
})
