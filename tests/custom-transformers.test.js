import path from 'path'
import { run, html, css } from './util/run'
import { env } from '../src/lib/sharedState'

let t = env.OXIDE ? test.skip : test

function customTransformer(content) {
  return content.replace(/uppercase/g, 'lowercase')
}

t('transform function', () => {
  let config = {
    content: {
      files: [{ raw: html`<div class="uppercase"></div>` }],
      transform: customTransformer,
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .lowercase {
        text-transform: lowercase;
      }
    `)
  })
})

t('transform.DEFAULT', () => {
  let config = {
    content: {
      files: [{ raw: html`<div class="uppercase"></div>` }],
      transform: {
        DEFAULT: customTransformer,
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .lowercase {
        text-transform: lowercase;
      }
    `)
  })
})

t('transform.{extension}', () => {
  let config = {
    content: {
      files: [
        path.resolve(__dirname, './custom-transformers.test.html'),
        path.resolve(__dirname, './custom-transformers.test.php'),
      ],
      transform: {
        html: () => 'uppercase',
        php: () => 'lowercase',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .uppercase {
        text-transform: uppercase;
      }
      .lowercase {
        text-transform: lowercase;
      }
    `)
  })
})
