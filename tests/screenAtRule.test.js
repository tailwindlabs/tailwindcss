import postcss from 'postcss'
import plugin from '../src/lib/substituteScreenAtRules'
import config from '../stubs/config.full.js'
import { css } from './util/run'

function run(input, opts = config) {
  return postcss([plugin({ tailwindConfig: opts })]).process(input, { from: undefined })
}

test('it can generate media queries from configured screen sizes', () => {
  let input = css`
    @screen sm {
      .banana {
        color: yellow;
      }
    }
    @screen md {
      .banana {
        color: red;
      }
    }
    @screen lg {
      .banana {
        color: green;
      }
    }
  `

  return run(input, {
    theme: {
      screens: {
        sm: '500px',
        md: '750px',
        lg: '1000px',
      },
    },
    separator: ':',
  }).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 500px) {
        .banana {
          color: #ff0;
        }
      }
      @media (min-width: 750px) {
        .banana {
          color: red;
        }
      }
      @media (min-width: 1000px) {
        .banana {
          color: green;
        }
      }
    `)
    expect(result.warnings().length).toBe(0)
  })
})
