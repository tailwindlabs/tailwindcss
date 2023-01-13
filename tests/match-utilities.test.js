import { run, html, css } from './util/run'

test('match utilities with modifiers', async () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="test test/foo test-1/foo test-2/foo test/[foo] test-1/[foo] test-[8]/[9]"
        ></div> `,
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
              '[8]/[9]': 'eightnine',
            },
            modifiers: 'any',
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
    .test-1\/\[foo\] {
      color: one_[foo];
    }
    .test-1\/foo {
      color: onefoo_null;
    }
    .test-2\/foo {
      color: two_foo;
    }
    .test-\[8\]\/\[9\] {
      color: eightnine_null;
    }
    .test\/\[foo\] {
      color: default_[foo];
    }
    .test\/foo {
      color: default_foo;
    }
  `)
})

test('match utilities with modifiers in the config', async () => {
  let config = {
    content: [
      {
        raw: html`<div class="test test/foo test-1/foo test/[bar] test-1/[bar]"></div> `,
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
            },
            modifiers: {
              foo: 'mewtwo',
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
    .test-1\/\[bar\] {
      color: one_bar;
    }
    .test-1\/foo {
      color: one_mewtwo;
    }
    .test\/\[bar\] {
      color: default_bar;
    }
    .test\/foo {
      color: default_mewtwo;
    }
  `)
})

test('match utilities can omit utilities by returning null', async () => {
  let config = {
    content: [
      {
        raw: html`<div class="test test/good test/bad"></div> `,
      },
    ],
    corePlugins: { preflight: false },

    plugins: [
      ({ matchUtilities }) => {
        matchUtilities(
          {
            test: (value, { modifier }) =>
              modifier === 'bad'
                ? null
                : {
                    color: `${value}_${modifier}`,
                  },
          },
          {
            values: {
              DEFAULT: 'default',
              bar: 'bar',
              '1': 'one',
            },
            modifiers: 'any',
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
    .test\/good {
      color: default_good;
    }
  `)
})

test('matching utilities with a basic configured value', () => {
  let config = {
    content: [{ raw: html`<div class="test-foo"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value) => ({ value }),
          },
          {
            values: {
              foo: 'value_foo',
            },
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-foo {
        value: value_foo;
      }
    `)
  })
})

test('matching utilities with an arbitrary value and configured modifier', () => {
  let config = {
    content: [{ raw: html`<div class="test-[foo]/bar"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value, { modifier }) => ({ value, modifier }),
          },
          {
            modifiers: {
              bar: 'configured_bar',
            },
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-\[foo\]\/bar {
        value: foo;
        modifier: configured_bar;
      }
    `)
  })
})

test('matching utilities with an configured value and an arbitrary modifier (raw)', () => {
  let config = {
    content: [{ raw: html`<div class="test-foo/[bar]"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value, { modifier }) => ({ value, modifier }),
          },
          {
            values: {
              foo: 'configured_foo',
            },
            modifiers: 'any', // Raw `[value]`
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-foo\/\[bar\] {
        value: configured_foo;
        modifier: [bar];
      }
    `)
  })
})

test('matching utilities with an configured value and an arbitrary modifier (non-raw)', () => {
  let config = {
    content: [{ raw: html`<div class="test-foo/[bar]"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value, { modifier }) => ({ value, modifier }),
          },
          {
            values: {
              foo: 'configured_foo',
            },
            modifiers: {},
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-foo\/\[bar\] {
        value: configured_foo;
        modifier: bar;
      }
    `)
  })
})

test('matching utilities with an configured value and a configured modifier', () => {
  let config = {
    content: [{ raw: html`<div class="test-foo/bar"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value, { modifier }) => ({ value, modifier }),
          },
          {
            values: {
              foo: 'configured_foo',
            },
            modifiers: {
              bar: 'configured_bar',
            },
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-foo\/bar {
        value: configured_foo;
        modifier: configured_bar;
      }
    `)
  })
})

test('matching utilities with an arbitrary value and an arbitrary modifier (raw)', () => {
  let config = {
    content: [{ raw: html`<div class="test-[foo]/[bar]"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value, { modifier }) => ({ value, modifier }),
          },
          {
            modifiers: 'any',
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-\[foo\]\/\[bar\] {
        value: foo;
        modifier: [bar];
      }
    `)
  })
})

test('matching utilities with an arbitrary value and an arbitrary modifier (non-raw)', () => {
  let config = {
    content: [{ raw: html`<div class="test-[foo]/[bar]"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value, { modifier }) => ({ value, modifier }),
          },
          {
            modifiers: {},
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-\[foo\]\/\[bar\] {
        value: foo;
        modifier: bar;
      }
    `)
  })
})

test('matching utilities with a lookup value that looks like an arbitrary value and modifier', () => {
  let config = {
    content: [{ raw: html`<div class="test-[foo]/[bar]"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value, { modifier }) => ({ value, modifier }),
          },
          {
            values: {
              '[foo]/[bar]': 'hello',
            },
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-\[foo\]\/\[bar\] {
        value: hello;
      }
    `)
  })
})

test('matching utilities with a lookup value that looks like an arbitrary value and modifier (with modifiers = any)', () => {
  let config = {
    content: [{ raw: html`<div class="test-[foo]/[bar]"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value, { modifier }) => ({ value, modifier }),
          },
          {
            values: {
              '[foo]/[bar]': 'hello',
            },
            modifiers: 'any',
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-\[foo\]\/\[bar\] {
        value: hello;
      }
    `)
  })
})

test('matching utilities with a lookup value that looks like an arbitrary value and modifier (with modifiers = {})', () => {
  let config = {
    content: [{ raw: html`<div class="test-[foo]/[bar]"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value, { modifier }) => ({ value, modifier }),
          },
          {
            values: {
              '[foo]/[bar]': 'hello',
            },
            modifiers: {},
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-\[foo\]\/\[bar\] {
        value: hello;
      }
    `)
  })
})

test('matching utilities with a lookup value that looks like an arbitrary value and a configured modifier', () => {
  let config = {
    content: [{ raw: html`<div class="test-[foo]/bar"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value, { modifier }) => ({ value, modifier }),
          },
          {
            values: {
              '[foo]/bar': 'hello',
            },
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-\[foo\]\/bar {
        value: hello;
      }
    `)
  })
})

test('matching utilities with a lookup value that looks like a configured value and an arbitrary modifier', () => {
  let config = {
    content: [{ raw: html`<div class="test-foo/[bar]"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value, { modifier }) => ({ value, modifier }),
          },
          {
            values: {
              'foo/[bar]': 'hello',
            },
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-foo\/\[bar\] {
        value: hello;
      }
    `)
  })
})

test('matching utilities with a lookup value that does not match the configured type', () => {
  let config = {
    content: [{ raw: html`<div class="test-foo"></div>` }],
    theme: {},
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities(
          {
            test: (value, { modifier }) => ({ value, modifier }),
          },
          {
            values: {
              foo: 'not-a-percentage',
            },
            type: ['percentage'],
          }
        )
      },
    ],
    corePlugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .test-foo {
        value: not-a-percentage;
      }
    `)
  })
})
