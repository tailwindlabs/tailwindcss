import { run, css } from './util/run'

test('relative purge paths', () => {
  let config = {
    content: ['./tests/relative-purge-paths.test.html'],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toIncludeCss(css`
      .font-bold {
        font-weight: 700;
      }
    `)
  })
})
