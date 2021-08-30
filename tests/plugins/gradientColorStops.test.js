import path from 'path'
import postcss from 'postcss'
import tailwind from '../../src/index'

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

test('opacity variables are given to colors defined as closures', () => {
  let config = {
    purge: [
      {
        raw: html`<div
          class="text-primary text-secondary text-opacity-50 from-primary from-secondary via-primary via-secondary to-primary to-secondary"
        ></div>`,
      },
    ],
    theme: {
      colors: {
        primary: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(31,31,31,${opacityValue})`
          }

          if (opacityVariable !== undefined) {
            return `rgba(31,31,31,var(${opacityVariable},1))`
          }

          return `rgb(31,31,31)`
        },
        secondary: 'hsl(10, 50%, 50%)',
      },
      opacity: {
        50: '0.5',
      },
    },
    plugins: [],
  }

  let content = css`
    @tailwind utilities;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .from-primary {
        --tw-gradient-from: rgb(31, 31, 31);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(31, 31, 31, 0));
      }
      .from-secondary {
        --tw-gradient-from: hsl(10, 50%, 50%);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, hsla(10, 50%, 50%, 0));
      }
      .via-primary {
        --tw-gradient-stops: var(--tw-gradient-from), rgb(31, 31, 31),
          var(--tw-gradient-to, rgba(31, 31, 31, 0));
      }
      .via-secondary {
        --tw-gradient-stops: var(--tw-gradient-from), hsl(10, 50%, 50%),
          var(--tw-gradient-to, hsla(10, 50%, 50%, 0));
      }
      .to-primary {
        --tw-gradient-to: rgb(31, 31, 31);
      }
      .to-secondary {
        --tw-gradient-to: hsl(10, 50%, 50%);
      }
      .text-primary {
        --tw-text-opacity: 1;
        color: rgba(31, 31, 31, var(--tw-text-opacity));
      }
      .text-secondary {
        --tw-text-opacity: 1;
        color: hsla(10, 50%, 50%, var(--tw-text-opacity));
      }
      .text-opacity-50 {
        --tw-text-opacity: 0.5;
      }
    `)
  })
})
