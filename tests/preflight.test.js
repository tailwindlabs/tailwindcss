import { run, html, css } from './util/run'

it('preflight has a correct border color fallback', () => {
  let config = {
    content: [{ raw: html`<div class="border-black"></div>` }],
    theme: {
      borderColor: ({ theme }) => theme('colors'),
    },
    plugins: [],
    corePlugins: { preflight: true },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toContain(`border-color: currentColor;`)
  })
})
