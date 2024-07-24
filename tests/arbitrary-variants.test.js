import { run, html, css, defaults } from './util/run'

test('basic arbitrary variants', () => {
  let config = {
    content: [{ raw: html`<div class="[&>*]:underline"></div>` }],
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
      .\[\&\>\*\]\:underline > * {
        text-decoration-line: underline;
      }
    `)
  })
})

test('spaces in selector (using _)', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[.a.b_&]:underline"></div>`,
      },
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
      .a.b .\[\.a\.b_\&\]\:underline {
        text-decoration-line: underline;
      }
    `)
  })
})

test('arbitrary variants with modifiers', () => {
  let config = {
    content: [{ raw: html`<div class="dark:lg:hover:[&>*]:underline"></div>` }],
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
      @media (prefers-color-scheme: dark) {
        @media (min-width: 1024px) {
          .dark\:lg\:hover\:\[\&\>\*\]\:underline > :hover {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

test('variants without & or an at-rule are ignored', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="[div]:underline"></div>
          <div class="[:hover]:underline"></div>
          <div class="[wtf-bbq]:underline"></div>
          <div class="[lol]:hover:underline"></div>
        `,
      },
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
    `)
  })
})

test('arbitrary variants are sorted after other variants', () => {
  let config = {
    content: [{ raw: html`<div class="underline lg:underline [&>*]:underline"></div>` }],
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
      .underline {
        text-decoration-line: underline;
      }
      @media (min-width: 1024px) {
        .lg\:underline {
          text-decoration-line: underline;
        }
      }
      .\[\&\>\*\]\:underline > * {
        text-decoration-line: underline;
      }
    `)
  })
})

test('using the important modifier', () => {
  let config = {
    content: [{ raw: html`<div class="[&>*]:!underline"></div>` }],
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
      .\[\&\>\*\]\:\!underline > * {
        text-decoration-line: underline !important;
      }
    `)
  })
})

test('at-rules', () => {
  let config = {
    content: [{ raw: html`<div class="[@supports(what:ever)]:underline"></div>` }],
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
      @supports (what: ever) {
        .\[\@supports\(what\:ever\)\]\:underline {
          text-decoration-line: underline;
        }
      }
    `)
  })
})

test('nested at-rules', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[@media_screen{@media(hover:hover)}]:underline"></div>`,
      },
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
      @media screen {
        @media (hover: hover) {
          .\[\@media_screen\{\@media\(hover\:hover\)\}\]\:underline {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

test('at-rules with selector modifications', () => {
  let config = {
    content: [{ raw: html`<div class="[@media(hover:hover){&:hover}]:underline"></div>` }],
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
      @media (hover: hover) {
        .\[\@media\(hover\:hover\)\{\&\:hover\}\]\:underline:hover {
          text-decoration-line: underline;
        }
      }
    `)
  })
})

test('nested at-rules with selector modifications', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[@media_screen{@media(hover:hover){&:hover}}]:underline"></div>`,
      },
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
      @media screen {
        @media (hover: hover) {
          .\[\@media_screen\{\@media\(hover\:hover\)\{\&\:hover\}\}\]\:underline:hover {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

test('attribute selectors', () => {
  let config = {
    content: [{ raw: html`<div class="[&[data-open]]:underline"></div>` }],
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
      .\[\&\[data-open\]\]\:underline[data-open] {
        text-decoration-line: underline;
      }
    `)
  })
})

test('multiple attribute selectors', () => {
  let config = {
    content: [{ raw: html`<div class="[&[data-foo][data-bar]:not([data-baz])]:underline"></div>` }],
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
      .\[\&\[data-foo\]\[data-bar\]\:not\(\[data-baz\]\)\]\:underline[data-foo][data-bar]:not([data-baz]) {
        text-decoration-line: underline;
      }
    `)
  })
})

test('multiple attribute selectors with custom separator (1)', () => {
  let config = {
    separator: '__',
    content: [
      { raw: html`<div class="[&[data-foo][data-bar]:not([data-baz])]__underline"></div>` },
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
      .\[\&\[data-foo\]\[data-bar\]\:not\(\[data-baz\]\)\]__underline[data-foo][data-bar]:not([data-baz]) {
        text-decoration-line: underline;
      }
    `)
  })
})

test('multiple attribute selectors with custom separator (2)', () => {
  let config = {
    separator: '_@',
    content: [
      { raw: html`<div class="[&[data-foo][data-bar]:not([data-baz])]_@underline"></div>` },
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
      .\[\&\[data-foo\]\[data-bar\]\:not\(\[data-baz\]\)\]_\@underline[data-foo][data-bar]:not([data-baz]) {
        text-decoration-line: underline;
      }
    `)
  })
})

test('with @apply', () => {
  let config = {
    content: [
      {
        raw: html`<div class="foo"></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;

      .foo {
        @apply [@media_screen{@media(hover:hover){&:hover}}]:underline;
      }
    `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults}
      @media screen {
        @media (hover: hover) {
          .foo:hover {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

test('keeps escaped underscores', () => {
  let config = {
    content: [
      {
        raw: '<div class="[&_.foo\\_\\_bar]:underline"></div>',
      },
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
      .\[\&_\.foo\\_\\_bar\]\:underline .foo__bar {
        text-decoration-line: underline;
      }
    `)
  })
})

test('keeps escaped underscores with multiple arbitrary variants', () => {
  let config = {
    content: [
      {
        raw: '<div class="[&_.foo\\_\\_bar]:[&_.bar\\_\\_baz]:underline"></div>',
      },
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
      .\[\&_\.foo\\_\\_bar\]\:\[\&_\.bar\\_\\_baz\]\:underline .bar__baz .foo__bar {
        text-decoration-line: underline;
      }
    `)
  })
})

test('does not add quotes on arbitrary variants', () => {
  let config = {
    content: [
      {
        raw: '<div class="[&[data-foo=\'1\']+.bar]:underline"></div>',
      },
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
      .\[\&\[data-foo\=\'1\'\]\+\.bar\]\:underline[data-foo='1']+.bar {
        text-decoration-line: underline;
      }
    `)
  })
})

test('keeps escaped underscores in arbitrary variants mixed with normal variants', () => {
  let config = {
    content: [
      {
        raw: `
          <div class="[&_.foo\\_\\_bar]:hover:underline"></div>
          <div class="hover:[&_.foo\\_\\_bar]:underline"></div>
        `,
      },
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
      .\[\&_\.foo\\_\\_bar\]\:hover\:underline:hover .foo__bar,
        .hover\:\[\&_\.foo\\_\\_bar\]\:underline .foo__bar:hover {
        text-decoration-line: underline;
      }
    `)
  })
})

test('allows attribute variants with quotes', () => {
  let config = {
    content: [
      {
        raw: `
          <div class="[&[data-test='2']]:underline"></div>
          <div class='[&[data-test="2"]]:underline'></div>
        `,
      },
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
      .\[\&\[data-test\=\"2\"\]\]\:underline[data-test='2'],
        .\[\&\[data-test\=\'2\'\]\]\:underline[data-test='2'] {
        text-decoration-line: underline;
      }
    `)
  })
})

test('classes in arbitrary variants should not be prefixed', () => {
  let config = {
    prefix: 'tw-',
    content: [
      {
        raw: `
          <div class="[.foo_&]:tw-text-red-400">should not be red</div>
          <div class="foo">
            <div class="[.foo_&]:tw-text-red-400">should be red</div>
          </div>
          <div class="[&_.foo]:tw-text-red-400">
            <div>should not be red</div>
            <div class="foo">should be red</div>
          </div>
          <div class="hover:[&_.foo]:tw-text-red-400">
            <div>should not be red</div>
            <div class="foo">should be red</div>
          </div>
          <div class="[&_.foo]:hover:tw-text-red-400">
            <div>should not be red</div>
            <div class="foo">should be red</div>
          </div>
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
      .\[\&_\.foo\]\:tw-text-red-400 .foo,
      .\[\&_\.foo\]\:hover\:tw-text-red-400:hover .foo,
      .hover\:\[\&_\.foo\]\:tw-text-red-400 .foo:hover,
      .foo .\[\.foo_\&\]\:tw-text-red-400 {
        --tw-text-opacity: 1;
        color: rgb(248 113 113 / var(--tw-text-opacity));
      }
    `)
  })
})

test('classes in the same arbitrary variant should not be prefixed', () => {
  let config = {
    prefix: 'tw-',
    content: [
      {
        raw: `
          <div class="[.foo_&]:tw-text-red-400 [.foo_&]:tw-bg-white">should not be red</div>
          <div class="foo">
            <div class="[.foo_&]:tw-text-red-400 [.foo_&]:tw-bg-white">should be red</div>
          </div>
          <div class="[&_.foo]:tw-text-red-400 [&_.foo]:tw-bg-white">
            <div>should not be red</div>
            <div class="foo">should be red</div>
          </div>
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
      .\[\&_\.foo\]\:tw-bg-white .foo {
        --tw-bg-opacity: 1;
        background-color: rgb(255 255 255 / var(--tw-bg-opacity));
      }
      .\[\&_\.foo\]\:tw-text-red-400 .foo {
        --tw-text-opacity: 1;
        color: rgb(248 113 113 / var(--tw-text-opacity));
      }
      .foo .\[\.foo_\&\]\:tw-bg-white {
        --tw-bg-opacity: 1;
        background-color: rgb(255 255 255 / var(--tw-bg-opacity));
      }
      .foo .\[\.foo_\&\]\:tw-text-red-400 {
        --tw-text-opacity: 1;
        color: rgb(248 113 113 / var(--tw-text-opacity));
      }
    `)
  })
})

it('should support aria variants', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="aria-checked:underline"></div>
            <div class="aria-[sort=ascending]:underline"></div>
            <div class="aria-[valuenow=1]:underline"></div>
            <div class="aria-[labelledby='a_b']:underline"></div>
            <div class="group-aria-checked:underline"></div>
            <div class="peer-aria-checked:underline"></div>
            <div class="group-aria-checked/foo:underline"></div>
            <div class="peer-aria-checked/foo:underline"></div>
            <div class="group-aria-[sort=ascending]:underline"></div>
            <div class="peer-aria-[sort=ascending]:underline"></div>
            <div class="group-aria-[labelledby='a_b']:underline"></div>
            <div class="peer-aria-[labelledby='a_b']:underline"></div>
            <div class="group-aria-[valuenow=1]:underline"></div>
            <div class="peer-aria-[valuenow=1]:underline"></div>
            <div class="group-aria-[sort=ascending]/foo:underline"></div>
            <div class="peer-aria-[sort=ascending]/foo:underline"></div>
          </div>
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
      .underline,
      .aria-checked\:underline[aria-checked='true'],
      .aria-\[labelledby\=\'a_b\'\]\:underline[aria-labelledby='a b'],
      .aria-\[sort\=ascending\]\:underline[aria-sort='ascending'],
      .aria-\[valuenow\=1\]\:underline[aria-valuenow='1'],
      .group\/foo[aria-checked='true'] .group-aria-checked\/foo\:underline,
      .group[aria-checked='true'] .group-aria-checked\:underline,
      .group[aria-labelledby='a b'] .group-aria-\[labelledby\=\'a_b\'\]\:underline,
      .group\/foo[aria-sort='ascending'] .group-aria-\[sort\=ascending\]\/foo\:underline,
      .group[aria-sort='ascending'] .group-aria-\[sort\=ascending\]\:underline,
      .group[aria-valuenow='1'] .group-aria-\[valuenow\=1\]\:underline,
      .peer\/foo[aria-checked='true'] ~ .peer-aria-checked\/foo\:underline,
      .peer[aria-checked='true'] ~ .peer-aria-checked\:underline,
      .peer[aria-labelledby='a b'] ~ .peer-aria-\[labelledby\=\'a_b\'\]\:underline,
      .peer\/foo[aria-sort='ascending'] ~ .peer-aria-\[sort\=ascending\]\/foo\:underline,
      .peer[aria-sort='ascending'] ~ .peer-aria-\[sort\=ascending\]\:underline,
      .peer[aria-valuenow='1'] ~ .peer-aria-\[valuenow\=1\]\:underline {
        text-decoration-line: underline;
      }
    `)
  })
})

it('should support data variants', () => {
  let config = {
    theme: {
      data: {
        checked: 'ui~="checked"',
      },
    },
    content: [
      {
        raw: html`
          <div>
            <div class="data-checked:underline"></div>
            <div class="data-[foo='bar_baz']:underline"></div>
            <div class="data-[id$='foo'_s]:underline"></div>
            <div class="data-[id$=foo_bar_s]:underline"></div>
            <div class="data-[id=0]:underline"></div>
            <div class="data-[position=top]:underline"></div>
            <div class="group-data-checked:underline"></div>
            <div class="peer-data-checked:underline"></div>
            <div class="group-data-checked/foo:underline"></div>
            <div class="peer-data-checked/foo:underline"></div>
            <div class="group-data-[position=top]:underline"></div>
            <div class="peer-data-[position=top]:underline"></div>
            <div class="group-data-[foo='bar_baz']:underline"></div>
            <div class="peer-data-[foo='bar_baz']:underline"></div>
            <div class="group-data-[id$='foo'_s]:underline"></div>
            <div class="group-data-[id$=foo_bar_s]:underline"></div>
            <div class="group-data-[id=0]:underline"></div>
            <div class="peer-data-[id$='foo'_s]:underline"></div>
            <div class="peer-data-[id$=foo_bar_s]:underline"></div>
            <div class="peer-data-[id=0]:underline"></div>
            <div class="group-data-[position=top]/foo:underline"></div>
            <div class="peer-data-[position=top]/foo:underline"></div>
          </div>
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
      .underline,
      .data-checked\:underline[data-ui~='checked'],
      .data-\[foo\=\'bar_baz\'\]\:underline[data-foo='bar baz'],
      .data-\[id\$\=\'foo\'_s\]\:underline[data-id$='foo' s],
      .data-\[id\$\=foo_bar_s\]\:underline[data-id$='foo bar' s],
      .data-\[id\=0\]\:underline[data-id='0'],
      .data-\[position\=top\]\:underline[data-position='top'],
      .group\/foo[data-ui~='checked'] .group-data-checked\/foo\:underline,
      .group[data-ui~='checked'] .group-data-checked\:underline,
      .group[data-foo='bar baz'] .group-data-\[foo\=\'bar_baz\'\]\:underline,
      .group[data-id$='foo' s] .group-data-\[id\$\=\'foo\'_s\]\:underline,
      .group[data-id$='foo bar' s] .group-data-\[id\$\=foo_bar_s\]\:underline,
      .group[data-id='0'] .group-data-\[id\=0\]\:underline,
      .group\/foo[data-position='top'] .group-data-\[position\=top\]\/foo\:underline,
      .group[data-position='top'] .group-data-\[position\=top\]\:underline,
      .peer\/foo[data-ui~='checked'] ~ .peer-data-checked\/foo\:underline,
      .peer[data-ui~='checked'] ~ .peer-data-checked\:underline,
      .peer[data-foo='bar baz'] ~ .peer-data-\[foo\=\'bar_baz\'\]\:underline,
      .peer[data-id$='foo' s] ~ .peer-data-\[id\$\=\'foo\'_s\]\:underline,
      .peer[data-id$='foo bar' s] ~ .peer-data-\[id\$\=foo_bar_s\]\:underline,
      .peer[data-id='0'] ~ .peer-data-\[id\=0\]\:underline,
      .peer\/foo[data-position='top'] ~ .peer-data-\[position\=top\]\/foo\:underline,
      .peer[data-position='top'] ~ .peer-data-\[position\=top\]\:underline {
        text-decoration-line: underline;
      }
    `)
  })
})

it('should support supports', () => {
  let config = {
    theme: {
      supports: {
        grid: 'display: grid',
      },
    },
    content: [
      {
        raw: html`
          <div>
            <!-- Property check -->
            <div class="supports-[display:grid]:grid"></div>
            <!-- Value with spaces, needs to be normalized -->
            <div class="supports-[transform-origin:5%_5%]:underline"></div>
            <!-- Selectors (raw) -->
            <div class="supports-[selector(A_>_B)]:underline"></div>
            <!-- 'not' check (raw) -->
            <div class="supports-[not(foo:bar)]:underline"></div>
            <!-- 'or' check (raw) -->
            <div class="supports-[(foo:bar)or(bar:baz)]:underline"></div>
            <!-- 'and' check (raw) -->
            <div class="supports-[(foo:bar)and(bar:baz)]:underline"></div>
            <!-- No value give for the property, defaulting to prop: var(--tw) -->
            <div class="supports-[container-type]:underline"></div>
            <!-- Named supports usage -->
            <div class="supports-grid:underline"></div>
          </div>
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
      @supports (display: grid) {
        .supports-grid\:underline {
          text-decoration-line: underline;
        }
        .supports-\[display\:grid\]\:grid {
          display: grid;
        }
      }
      @supports (foo: bar) and (bar: baz) {
        .supports-\[\(foo\:bar\)and\(bar\:baz\)\]\:underline {
          text-decoration-line: underline;
        }
      }
      @supports (foo: bar) or (bar: baz) {
        .supports-\[\(foo\:bar\)or\(bar\:baz\)\]\:underline {
          text-decoration-line: underline;
        }
      }
      @supports (container-type: var(--tw)) {
        .supports-\[container-type\]\:underline {
          text-decoration-line: underline;
        }
      }
      @supports not (foo: bar) {
        .supports-\[not\(foo\:bar\)\]\:underline {
          text-decoration-line: underline;
        }
      }
      @supports selector(A > B) {
        .supports-\[selector\(A_\>_B\)\]\:underline {
          text-decoration-line: underline;
        }
      }
      @supports (transform-origin: 5% 5%) {
        .supports-\[transform-origin\:5\%_5\%\]\:underline {
          text-decoration-line: underline;
        }
      }
    `)
  })
})

test('has-* variants with arbitrary values', () => {
  let config = {
    theme: {},
    content: [
      {
        raw: html`
          <div>
            <figure class="has-[figcaption]:inline-block"></figure>
            <div class="has-[.foo]:flex"></div>
            <div class="has-[.foo:hover]:block"></div>
            <div class="has-[[data-active]]:inline"></div>
            <div class="has-[>_.potato]:table"></div>
            <div class="has-[+_h2]:grid"></div>
            <div class="has-[>_h1_+_h2]:contents"></div>
            <div class="has-[h2]:has-[.banana]:hidden"></div>
            <div class="has-[[data-foo='1']+div]:font-bold"></div>
          </div>
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
      .has-\[\.foo\:hover\]\:block:has(.foo:hover) {
        display: block;
      }
      .has-\[figcaption\]\:inline-block:has(figcaption) {
        display: inline-block;
      }
      .has-\[\[data-active\]\]\:inline:has([data-active]) {
        display: inline;
      }
      .has-\[\.foo\]\:flex:has(.foo) {
        display: flex;
      }
      .has-\[\>_\.potato\]\:table:has(> .potato) {
        display: table;
      }
      .has-\[\+_h2\]\:grid:has(+ h2) {
        display: grid;
      }
      .has-\[\>_h1_\+_h2\]\:contents:has(> h1 + h2) {
        display: contents;
      }
      .has-\[h2\]\:has-\[\.banana\]\:hidden:has(.banana):has(h2) {
        display: none;
      }
      .has-\[\[data-foo\=\'1\'\]\+div\]\:font-bold:has([data-foo='1'] + div) {
        font-weight: 700;
      }
    `)
  })
})

test('group-has-* variants with arbitrary values', () => {
  let config = {
    theme: {},
    content: [
      {
        raw: html`
          <div class="group">
            <div class="group-has-[>_h1_+_.foo]:block"></div>
          </div>
          <div class="group/two">
            <div class="group-has-[>_h1_+_.foo]/two:flex"></div>
          </div>
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
      .group:has(> h1 + .foo) .group-has-\[\>_h1_\+_\.foo\]\:block {
        display: block;
      }
      .group\/two:has(> h1 + .foo) .group-has-\[\>_h1_\+_\.foo\]\/two\:flex {
        display: flex;
      }
    `)
  })
})

test('peer-has-* variants with arbitrary values', () => {
  let config = {
    theme: {},
    content: [
      {
        raw: html`
          <div>
            <div className="peer"></div>
            <div class="peer-has-[>_h1_+_.foo]:block"></div>
          </div>
          <div>
            <div className="peer"></div>
            <div class="peer-has-[>_h1_+_.foo]/two:flex"></div>
          </div>
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
      .peer:has(> h1 + .foo) ~ .peer-has-\[\>_h1_\+_\.foo\]\:block {
        display: block;
      }
      .peer\/two:has(> h1 + .foo) ~ .peer-has-\[\>_h1_\+_\.foo\]\/two\:flex {
        display: flex;
      }
    `)
  })
})

it('should be possible to use modifiers and arbitrary groups', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="group">
              <!-- Default group usage -->
              <div class="group-hover:underline"></div>

              <!-- Arbitrary variants with pseudo class for group -->
              <!-- With & -->
              <div class="group-[&:focus]:underline"></div>
              <!-- Without & -->
              <div class="group-[:hover]:underline"></div>

              <!-- Arbitrary variants with attributes selectors for group -->
              <!-- With & -->
              <div class="group-[&[data-open]]:underline"></div>
              <!-- Without & -->
              <div class="group-[[data-open]]:underline"></div>

              <!-- Arbitrary variants with other selectors -->
              <!-- With & -->
              <div class="group-[.in-foo_&]:underline"></div>
              <!-- Without & -->
              <div class="group-[.in-foo]:underline"></div>
            </div>

            <!-- The same as above, but with modifiers -->
            <div class="group/foo">
              <div class="group-hover/foo:underline"></div>

              <div class="group-[&:focus]/foo:underline"></div>
              <div class="group-[:hover]/foo:underline"></div>

              <div class="group-[&[data-open]]/foo:underline"></div>
              <div class="group-[[data-open]]/foo:underline"></div>

              <div class="group-[.in-foo_&]/foo:underline"></div>
              <div class="group-[.in-foo]/foo:underline"></div>
            </div>
          </div>
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
      .group\/foo:hover .group-hover\/foo\:underline,
      .group:hover .group-hover\:underline,
      .group\/foo:focus .group-\[\&\:focus\]\/foo\:underline,
      .group:focus .group-\[\&\:focus\]\:underline,
      .group\/foo[data-open] .group-\[\&\[data-open\]\]\/foo\:underline,
      .group[data-open] .group-\[\&\[data-open\]\]\:underline,
      .group\/foo.in-foo .group-\[\.in-foo\]\/foo\:underline,
      .group.in-foo .group-\[\.in-foo\]\:underline,
      .in-foo .group\/foo .group-\[\.in-foo_\&\]\/foo\:underline,
      .in-foo .group .group-\[\.in-foo_\&\]\:underline,
      .group\/foo:hover .group-\[\:hover\]\/foo\:underline,
      .group:hover .group-\[\:hover\]\:underline,
      .group\/foo[data-open] .group-\[\[data-open\]\]\/foo\:underline,
      .group[data-open] .group-\[\[data-open\]\]\:underline {
        text-decoration-line: underline;
      }
    `)
  })
})

it('should be possible to use modifiers and arbitrary peers', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="peer"></div>

            <!-- Default peer usage -->
            <div class="peer-hover:underline"></div>

            <!-- Arbitrary variants with pseudo class for peer -->
            <!-- With & -->
            <div class="peer-[&:focus]:underline"></div>
            <!-- Without & -->
            <div class="peer-[:hover]:underline"></div>

            <!-- Arbitrary variants with attributes selectors for peer -->
            <!-- With & -->
            <div class="peer-[&[data-open]]:underline"></div>
            <!-- Without & -->
            <div class="peer-[[data-open]]:underline"></div>

            <!-- Arbitrary variants with other selectors -->
            <!-- With & -->
            <div class="peer-[.in-foo_&]:underline"></div>
            <!-- Without & -->
            <div class="peer-[.in-foo]:underline"></div>

            <!-- The same as above, but with modifiers -->
            <div class="peer/foo"></div>

            <div class="peer-hover/foo:underline"></div>

            <div class="peer-[&:focus]/foo:underline"></div>
            <div class="peer-[:hover]/foo:underline"></div>

            <div class="peer-[&[data-open]]/foo:underline"></div>
            <div class="peer-[[data-open]]/foo:underline"></div>

            <div class="peer-[.in-foo_&]/foo:underline"></div>
            <div class="peer-[.in-foo]/foo:underline"></div>
          </div>
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
      .peer\/foo:hover ~ .peer-hover\/foo\:underline,
      .peer:hover ~ .peer-hover\:underline,
      .peer\/foo:focus ~ .peer-\[\&\:focus\]\/foo\:underline,
      .peer:focus ~ .peer-\[\&\:focus\]\:underline,
      .peer\/foo[data-open] ~ .peer-\[\&\[data-open\]\]\/foo\:underline,
      .peer[data-open] ~ .peer-\[\&\[data-open\]\]\:underline,
      .peer\/foo.in-foo ~ .peer-\[\.in-foo\]\/foo\:underline,
      .peer.in-foo ~ .peer-\[\.in-foo\]\:underline,
      .in-foo .peer\/foo ~ .peer-\[\.in-foo_\&\]\/foo\:underline,
      .in-foo .peer ~ .peer-\[\.in-foo_\&\]\:underline,
      .peer\/foo:hover ~ .peer-\[\:hover\]\/foo\:underline,
      .peer:hover ~ .peer-\[\:hover\]\:underline,
      .peer\/foo[data-open] ~ .peer-\[\[data-open\]\]\/foo\:underline,
      .peer[data-open] ~ .peer-\[\[data-open\]\]\:underline {
        text-decoration-line: underline;
      }
    `)
  })
})

it('Arbitrary variants are ordered alphabetically', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="[&::b]:underline"></div>
            <div class="[&::a]:underline"></div>
            <div class="[&::c]:underline"></div>
            <div class="[&::b]:underline"></div>
          </div>
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
      .\[\&\:\:a\]\:underline::a {
        text-decoration-line: underline;
      }
      .\[\&\:\:b\]\:underline::b {
        text-decoration-line: underline;
      }
      .\[\&\:\:c\]\:underline::c {
        text-decoration-line: underline;
      }
    `)
  })
})

it('Arbitrary variants support multiple attribute selectors', () => {
  let config = {
    content: [
      {
        raw: html` <div class="[[data-foo='bar'][data-baz]_&]:underline"></div> `,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      [data-foo='bar'][data-baz] .\[\[data-foo\=\'bar\'\]\[data-baz\]_\&\]\:underline {
        text-decoration-line: underline;
      }
    `)
  })
})

it('Invalid arbitrary variants selectors should produce nothing instead of failing', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="[&;foo]:underline"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css``)
  })
})

it('should output responsive variants + stacked variants in the right order', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="xl:p-1"></div>
          <div class="md:[&_ul]:flex-row"></div>
          <div class="[&_ul]:flex"></div>
          <div class="[&_ul]:flex-col"></div>
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
      @media (min-width: 1280px) {
        .xl\:p-1 {
          padding: 0.25rem;
        }
      }
      .\[\&_ul\]\:flex ul {
        display: flex;
      }
      .\[\&_ul\]\:flex-col ul {
        flex-direction: column;
      }
      @media (min-width: 768px) {
        .md\:\[\&_ul\]\:flex-row ul {
          flex-direction: row;
        }
      }
    `)
  })
})

it('it should discard arbitrary variants with multiple selectors', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="p-1"></div>
          <div class="[div]:p-1"></div>
          <div class="[div_&]:p-1"></div>
          <div class="[div,span]:p-1"></div>
          <div class="[div_&,span]:p-1"></div>
          <div class="[div,span_&]:p-1"></div>
          <div class="[div_&,span_&]:p-1"></div>
          <div class="hover:[div]:p-1"></div>
          <div class="hover:[div_&]:p-1"></div>
          <div class="hover:[div,span]:p-1"></div>
          <div class="hover:[div_&,span]:p-1"></div>
          <div class="hover:[div,span_&]:p-1"></div>
          <div class="hover:[div_&,span_&]:p-1"></div>
          <div class="hover:[:is(span,div)_&]:p-1"></div>
        `,
      },
      {
        // escaped commas are a-ok
        // This is separate because prettier complains about `\,` in the template string
        raw: '<div class="hover:[.span\\,div_&]:p-1"></div>',
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .p-1,
      .span\,div .hover\:\[\.span\\\,div_\&\]\:p-1:hover,
      :is(span, div) .hover\:\[\:is\(span\,div\)_\&\]\:p-1:hover,
      div .\[div_\&\]\:p-1,
      div .hover\:\[div_\&\]\:p-1:hover {
        padding: 0.25rem;
      }
    `)
  })
})

it('should sort multiple variant fns with normal variants between them', () => {
  /** @type {string[]} */
  let lines = []

  for (let a of [1, 2]) {
    for (let b of [2, 1]) {
      for (let c of [1, 2]) {
        for (let d of [2, 1]) {
          for (let e of [1, 2]) {
            lines.push(`<div class="fred${a}:qux-[${b}]:baz${c}:bar-[${d}]:foo${e}:p-1"></div>`)
          }
        }
      }
    }
  }

  // Fisher-Yates shuffle
  for (let i = lines.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i)
    ;[lines[i], lines[j]] = [lines[j], lines[i]]
  }

  let config = {
    content: [
      {
        raw: lines.join('\n'),
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      function ({ addVariant, matchVariant }) {
        addVariant('foo1', "&[data-foo='1']")
        addVariant('foo2', "&[data-foo='2']")

        matchVariant('bar', (value) => `&[data-bar='${value}']`, {
          sort: (a, b) => b.value - a.value,
        })

        addVariant('baz1', "&[data-baz='1']")
        addVariant('baz2', "&[data-baz='2']")

        matchVariant('qux', (value) => `&[data-qux='${value}']`, {
          sort: (a, b) => b.value - a.value,
        })

        addVariant('fred1', "&[data-fred='1']")
        addVariant('fred2', "&[data-fred='2']")
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .fred1\:qux-\[2\]\:baz1\:bar-\[2\]\:foo1\:p-1[data-foo='1'][data-bar='2'][data-baz='1'][data-qux='2'][data-fred='1'],
      .fred1\:qux-\[2\]\:baz1\:bar-\[2\]\:foo2\:p-1[data-foo='2'][data-bar='2'][data-baz='1'][data-qux='2'][data-fred='1'],
      .fred1\:qux-\[2\]\:baz1\:bar-\[1\]\:foo1\:p-1[data-foo='1'][data-bar='1'][data-baz='1'][data-qux='2'][data-fred='1'],
      .fred1\:qux-\[2\]\:baz1\:bar-\[1\]\:foo2\:p-1[data-foo='2'][data-bar='1'][data-baz='1'][data-qux='2'][data-fred='1'],
      .fred1\:qux-\[2\]\:baz2\:bar-\[2\]\:foo1\:p-1[data-foo='1'][data-bar='2'][data-baz='2'][data-qux='2'][data-fred='1'],
      .fred1\:qux-\[2\]\:baz2\:bar-\[2\]\:foo2\:p-1[data-foo='2'][data-bar='2'][data-baz='2'][data-qux='2'][data-fred='1'],
      .fred1\:qux-\[2\]\:baz2\:bar-\[1\]\:foo1\:p-1[data-foo='1'][data-bar='1'][data-baz='2'][data-qux='2'][data-fred='1'],
      .fred1\:qux-\[2\]\:baz2\:bar-\[1\]\:foo2\:p-1[data-foo='2'][data-bar='1'][data-baz='2'][data-qux='2'][data-fred='1'],
      .fred1\:qux-\[1\]\:baz1\:bar-\[2\]\:foo1\:p-1[data-foo='1'][data-bar='2'][data-baz='1'][data-qux='1'][data-fred='1'],
      .fred1\:qux-\[1\]\:baz1\:bar-\[2\]\:foo2\:p-1[data-foo='2'][data-bar='2'][data-baz='1'][data-qux='1'][data-fred='1'],
      .fred1\:qux-\[1\]\:baz1\:bar-\[1\]\:foo1\:p-1[data-foo='1'][data-bar='1'][data-baz='1'][data-qux='1'][data-fred='1'],
      .fred1\:qux-\[1\]\:baz1\:bar-\[1\]\:foo2\:p-1[data-foo='2'][data-bar='1'][data-baz='1'][data-qux='1'][data-fred='1'],
      .fred1\:qux-\[1\]\:baz2\:bar-\[2\]\:foo1\:p-1[data-foo='1'][data-bar='2'][data-baz='2'][data-qux='1'][data-fred='1'],
      .fred1\:qux-\[1\]\:baz2\:bar-\[2\]\:foo2\:p-1[data-foo='2'][data-bar='2'][data-baz='2'][data-qux='1'][data-fred='1'],
      .fred1\:qux-\[1\]\:baz2\:bar-\[1\]\:foo1\:p-1[data-foo='1'][data-bar='1'][data-baz='2'][data-qux='1'][data-fred='1'],
      .fred1\:qux-\[1\]\:baz2\:bar-\[1\]\:foo2\:p-1[data-foo='2'][data-bar='1'][data-baz='2'][data-qux='1'][data-fred='1'],
      .fred2\:qux-\[2\]\:baz1\:bar-\[2\]\:foo1\:p-1[data-foo='1'][data-bar='2'][data-baz='1'][data-qux='2'][data-fred='2'],
      .fred2\:qux-\[2\]\:baz1\:bar-\[2\]\:foo2\:p-1[data-foo='2'][data-bar='2'][data-baz='1'][data-qux='2'][data-fred='2'],
      .fred2\:qux-\[2\]\:baz1\:bar-\[1\]\:foo1\:p-1[data-foo='1'][data-bar='1'][data-baz='1'][data-qux='2'][data-fred='2'],
      .fred2\:qux-\[2\]\:baz1\:bar-\[1\]\:foo2\:p-1[data-foo='2'][data-bar='1'][data-baz='1'][data-qux='2'][data-fred='2'],
      .fred2\:qux-\[2\]\:baz2\:bar-\[2\]\:foo1\:p-1[data-foo='1'][data-bar='2'][data-baz='2'][data-qux='2'][data-fred='2'],
      .fred2\:qux-\[2\]\:baz2\:bar-\[2\]\:foo2\:p-1[data-foo='2'][data-bar='2'][data-baz='2'][data-qux='2'][data-fred='2'],
      .fred2\:qux-\[2\]\:baz2\:bar-\[1\]\:foo1\:p-1[data-foo='1'][data-bar='1'][data-baz='2'][data-qux='2'][data-fred='2'],
      .fred2\:qux-\[2\]\:baz2\:bar-\[1\]\:foo2\:p-1[data-foo='2'][data-bar='1'][data-baz='2'][data-qux='2'][data-fred='2'],
      .fred2\:qux-\[1\]\:baz1\:bar-\[2\]\:foo1\:p-1[data-foo='1'][data-bar='2'][data-baz='1'][data-qux='1'][data-fred='2'],
      .fred2\:qux-\[1\]\:baz1\:bar-\[2\]\:foo2\:p-1[data-foo='2'][data-bar='2'][data-baz='1'][data-qux='1'][data-fred='2'],
      .fred2\:qux-\[1\]\:baz1\:bar-\[1\]\:foo1\:p-1[data-foo='1'][data-bar='1'][data-baz='1'][data-qux='1'][data-fred='2'],
      .fred2\:qux-\[1\]\:baz1\:bar-\[1\]\:foo2\:p-1[data-foo='2'][data-bar='1'][data-baz='1'][data-qux='1'][data-fred='2'],
      .fred2\:qux-\[1\]\:baz2\:bar-\[2\]\:foo1\:p-1[data-foo='1'][data-bar='2'][data-baz='2'][data-qux='1'][data-fred='2'],
      .fred2\:qux-\[1\]\:baz2\:bar-\[2\]\:foo2\:p-1[data-foo='2'][data-bar='2'][data-baz='2'][data-qux='1'][data-fred='2'],
      .fred2\:qux-\[1\]\:baz2\:bar-\[1\]\:foo1\:p-1[data-foo='1'][data-bar='1'][data-baz='2'][data-qux='1'][data-fred='2'],
      .fred2\:qux-\[1\]\:baz2\:bar-\[1\]\:foo2\:p-1[data-foo='2'][data-bar='1'][data-baz='2'][data-qux='1'][data-fred='2'] {
        padding: 0.25rem;
      }
    `)
  })
})
