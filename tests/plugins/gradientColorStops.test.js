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
        --tw-gradient-from: #1f1f1f var(--tw-gradient-from-position);
        --tw-gradient-to: #1f1f1f00 var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .from-secondary {
        --tw-gradient-from: #bf5540 var(--tw-gradient-from-position);
        --tw-gradient-to: #bf554000 var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .via-primary {
        --tw-gradient-to: #1f1f1f00 var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), #1f1f1f var(--tw-gradient-via-position),
          var(--tw-gradient-to);
      }
      .via-secondary {
        --tw-gradient-to: #bf554000 var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), #bf5540 var(--tw-gradient-via-position),
          var(--tw-gradient-to);
      }
      .to-primary {
        --tw-gradient-to: #1f1f1f var(--tw-gradient-to-position);
      }
      .to-secondary {
        --tw-gradient-to: #bf5540 var(--tw-gradient-to-position);
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

test('gradient color stop position', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div
              class="bg-gradient-to-r from-red-500 from-50 via-pink-500 via-75 to-violet-400 to-80"
            ></div>
            <div class="from-10% from-[11%] from-[12px] from-[--from-value]"></div>
            <div class="via-20% via-[12%] via-[123px] via-[--via-value]"></div>
            <div class="to-30% to-[13%] to-[14px] to-[--to-value]"></div>
          </div>
        `,
      },
    ],
    theme: {},
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-gradient-to-r {
        background-image: linear-gradient(to right, var(--tw-gradient-stops));
      }
      .from-\[--from-value\] {
        --tw-gradient-from: var(--from-value) var(--tw-gradient-from-position);
        --tw-gradient-to: #fff0 var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .from-red-500 {
        --tw-gradient-from: #ef4444 var(--tw-gradient-from-position);
        --tw-gradient-to: #ef444400 var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .from-10\% {
        --tw-gradient-from-position: 10%;
      }
      .from-\[11\%\] {
        --tw-gradient-from-position: 11%;
      }
      .from-\[12px\] {
        --tw-gradient-from-position: 12px;
      }
      .via-\[--via-value\] {
        --tw-gradient-to: #fff0 var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from),
          var(--via-value) var(--tw-gradient-via-position), var(--tw-gradient-to);
      }
      .via-pink-500 {
        --tw-gradient-to: #ec489900 var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), #ec4899 var(--tw-gradient-via-position),
          var(--tw-gradient-to);
      }
      .via-20\% {
        --tw-gradient-via-position: 20%;
      }
      .via-\[12\%\] {
        --tw-gradient-via-position: 12%;
      }
      .via-\[123px\] {
        --tw-gradient-via-position: 123px;
      }
      .to-\[--to-value\] {
        --tw-gradient-to: var(--to-value) var(--tw-gradient-to-position);
      }
      .to-violet-400 {
        --tw-gradient-to: #a78bfa var(--tw-gradient-to-position);
      }
      .to-30\% {
        --tw-gradient-to-position: 30%;
      }
      .to-\[13\%\] {
        --tw-gradient-to-position: 13%;
      }
      .to-\[14px\] {
        --tw-gradient-to-position: 14px;
      }
    `)
  })
})
