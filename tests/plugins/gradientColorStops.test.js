import { run, html, css } from '../util/run'

test('opacity variables are given to colors defined as closures', () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="text-primary text-secondary from-primary from-secondary via-primary via-secondary to-primary to-secondary text-opacity-50"
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
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .from-primary {
        --tw-gradient-from: rgb(31, 31, 31);
        --tw-gradient-to: rgba(31, 31, 31, 0);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .from-secondary {
        --tw-gradient-from: hsl(10, 50%, 50%);
        --tw-gradient-to: hsl(10 50% 50% / 0);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .via-primary {
        --tw-gradient-to: rgba(31, 31, 31, 0);
        --tw-gradient-stops: var(--tw-gradient-from), rgb(31, 31, 31), var(--tw-gradient-to);
      }
      .via-secondary {
        --tw-gradient-to: hsl(10 50% 50% / 0);
        --tw-gradient-stops: var(--tw-gradient-from), hsl(10, 50%, 50%), var(--tw-gradient-to);
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
        color: hsl(10 50% 50% / var(--tw-text-opacity));
      }
      .text-opacity-50 {
        --tw-text-opacity: 0.5;
      }
    `)
  })
})
