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
    // Lightning CSS optimizes this to just `border-color: 0 solid;` because `currentcolor` is the default user-agent stylesheet value.
    // https://drafts.csswg.org/css-backgrounds/#border-color
    expect(result.css).toContain(`border: 0 solid;`)
  })
})
