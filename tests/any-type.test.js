import { run, html, css } from './util/run'

test('any types are set on correct plugins', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="divide-y-[var(--any-value)]"></div>
          <div class="border-[var(--any-value)]"></div>
          <div class="border-x-[var(--any-value)]"></div>
          <div class="border-y-[var(--any-value)]"></div>
          <div class="border-t-[var(--any-value)]"></div>
          <div class="border-r-[var(--any-value)]"></div>
          <div class="border-b-[var(--any-value)]"></div>
          <div class="border-l-[var(--any-value)]"></div>
          <div class="bg-[var(--any-value)]"></div>
          <div class="from-[var(--any-value)]"></div>
          <div class="via-[var(--any-value)]"></div>
          <div class="to-[var(--any-value)]"></div>
          <div class="fill-[var(--any-value)]"></div>
          <div class="stroke-[var(--any-value)]"></div>
          <div class="text-[var(--any-value)]"></div>
          <div class="decoration-[var(--any-value)]"></div>
          <div class="placeholder-[var(--any-value)]"></div>
          <div class="caret-[var(--any-value)]"></div>
          <div class="accent-[var(--any-value)]"></div>
          <div class="shadow-[var(--any-value)]"></div>
          <div class="outline-[var(--any-value)]"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .divide-y-\[var\(--any-value\)\] > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-y-reverse: 0;
        border-top-width: calc(var(--any-value) * calc(1 - var(--tw-divide-y-reverse)));
        border-bottom-width: calc(var(--any-value) * var(--tw-divide-y-reverse));
      }
      .border-\[var\(--any-value\)\] {
        border-color: var(--any-value);
      }
      .border-x-\[var\(--any-value\)\] {
        border-left-color: var(--any-value);
        border-right-color: var(--any-value);
      }
      .border-y-\[var\(--any-value\)\] {
        border-top-color: var(--any-value);
        border-bottom-color: var(--any-value);
      }
      .border-t-\[var\(--any-value\)\] {
        border-top-color: var(--any-value);
      }
      .border-r-\[var\(--any-value\)\] {
        border-right-color: var(--any-value);
      }
      .border-b-\[var\(--any-value\)\] {
        border-bottom-color: var(--any-value);
      }
      .border-l-\[var\(--any-value\)\] {
        border-left-color: var(--any-value);
      }
      .bg-\[var\(--any-value\)\] {
        background-color: var(--any-value);
      }
      .from-\[var\(--any-value\)\] {
        --tw-gradient-from: var(--any-value);
        --tw-gradient-to: rgb(255 255 255 / 0);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .via-\[var\(--any-value\)\] {
        --tw-gradient-to: rgb(255 255 255 / 0);
        --tw-gradient-stops: var(--tw-gradient-from), var(--any-value), var(--tw-gradient-to);
      }
      .to-\[var\(--any-value\)\] {
        --tw-gradient-to: var(--any-value);
      }
      .fill-\[var\(--any-value\)\] {
        fill: var(--any-value);
      }
      .stroke-\[var\(--any-value\)\] {
        stroke: var(--any-value);
      }
      .text-\[var\(--any-value\)\] {
        font-size: var(--any-value);
      }
      .decoration-\[var\(--any-value\)\] {
        text-decoration-color: var(--any-value);
      }
      .placeholder-\[var\(--any-value\)\]::placeholder {
        color: var(--any-value);
      }
      .caret-\[var\(--any-value\)\] {
        caret-color: var(--any-value);
      }
      .accent-\[var\(--any-value\)\] {
        accent-color: var(--any-value);
      }
      .shadow-\[var\(--any-value\)\] {
        --tw-shadow: var(--any-value);
        --tw-shadow-colored: var(--any-value);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
      .outline-\[var\(--any-value\)\] {
        outline-color: var(--any-value);
      }
    `)
  })
})
