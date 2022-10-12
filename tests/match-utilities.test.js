import { run, html, css } from './util/run'

test('match utilities with modifiers', async () => {
  let config = {
    content: [
      {
        raw: html`<div class="test test/foo test-1/foo test-2/foo test/[foo] test-1/[foo]"></div> `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchUtilities }) => {
        matchUtilities(
          {
            test: (value, { modifier }) => ({
              color: `${value}_${modifier}`,
            }),
          },
          {
            values: {
              DEFAULT: 'default',
              bar: 'bar',
              '1': 'one',
              '2': 'two',
              '1/foo': 'onefoo',
            },
          }
        )
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .test {
      color: default_null;
    }
    .test\/foo {
      color: default_foo;
    }
    .test-1\/foo {
      color: onefoo_null;
    }
    .test-2\/foo {
      color: two_foo;
    }
    .test\/\[foo\] {
      color: default_[foo];
    }
    .test-1\/\[foo\] {
      color: one_[foo];
    }
  `)
})
