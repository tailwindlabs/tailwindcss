import * as path from 'path'
import { run, css, defaults } from './util/run'

it('should be possible to use negated content patterns', () => {
  let config = {
    content: [
      path.resolve(__dirname, './negated-content-*.test.html'),
      '!' + path.resolve(__dirname, './negated-content-ignore.test.html'),
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults}
      .uppercase {
        text-transform: uppercase;
      }
    `)
  })
})
