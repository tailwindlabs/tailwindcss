import { css, run } from './util/run'
import { normalize } from '../src/util/dataTypes'

let table = [
  ['foo', 'foo'],
  ['foo-bar', 'foo-bar'],
  ['16/9', '16/9'],
  ['16_/_9', '16 / 9'],

  // '_'s are converted to spaces except when escaped
  ['foo_bar', 'foo bar'],
  ['foo__bar', 'foo  bar'],
  ['foo\\_bar', 'foo_bar'],

  // Urls are preserved as-is
  [
    'url("https://example.com/abc+def/some-path/2022-01-01-abc/some_underscoered_path")',
    'url("https://example.com/abc+def/some-path/2022-01-01-abc/some_underscoered_path")',
  ],

  // file-path-like-things without quotes are preserved as-is
  ['/foo/bar/baz.png', '/foo/bar/baz.png'],
  ['/foo/bar-2/baz.png', '/foo/bar-2/baz.png'],

  // var(…) is preserved as is
  ['var(--foo)', 'var(--foo)'],
  ['var(--headings-h1-size)', 'var(--headings-h1-size)'],

  // math functions like calc(…) get spaces around operators
  ['calc(1+2)', 'calc(1 + 2)'],
  ['calc(100%+1rem)', 'calc(100% + 1rem)'],
  ['calc(1+calc(100%-20px))', 'calc(1 + calc(100% - 20px))'],
  ['calc(var(--headings-h1-size)*100)', 'calc(var(--headings-h1-size) * 100)'],
  [
    'calc(var(--headings-h1-size)*calc(100%+50%))',
    'calc(var(--headings-h1-size) * calc(100% + 50%))',
  ],
  ['min(1+2)', 'min(1 + 2)'],
  ['max(1+2)', 'max(1 + 2)'],
  ['clamp(1+2,1+3,1+4)', 'clamp(1 + 2,1 + 3,1 + 4)'],
  ['var(--heading-h1-font-size)', 'var(--heading-h1-font-size)'],
  ['var(--my-var-with-more-than-3-words)', 'var(--my-var-with-more-than-3-words)'],
  ['var(--width, calc(100%+1rem))', 'var(--width, calc(100% + 1rem))'],

  ['calc(1px*(7--12/24))', 'calc(1px * (7 - -12 / 24))'],
  ['calc((7-32)/(1400-782))', 'calc((7 - 32) / (1400 - 782))'],
  ['calc((7-3)/(1400-782))', 'calc((7 - 3) / (1400 - 782))'],
  ['calc((7-32)/(1400-782))', 'calc((7 - 32) / (1400 - 782))'],
  ['calc((70-3)/(1400-782))', 'calc((70 - 3) / (1400 - 782))'],
  ['calc((70-32)/(1400-782))', 'calc((70 - 32) / (1400 - 782))'],
  ['calc((704-3)/(1400-782))', 'calc((704 - 3) / (1400 - 782))'],
  ['calc((704-320))', 'calc((704 - 320))'],
  ['calc((704-320)/1)', 'calc((704 - 320) / 1)'],
  ['calc((704-320)/(1400-782))', 'calc((704 - 320) / (1400 - 782))'],
  ['calc(24px+-1rem)', 'calc(24px + -1rem)'],
  ['calc(24px+(-1rem))', 'calc(24px + (-1rem))'],
  ['calc(24px_+_-1rem)', 'calc(24px + -1rem)'],
  ['calc(24px+(-1rem))', 'calc(24px + (-1rem))'],
  ['calc(24px_+_(-1rem))', 'calc(24px + (-1rem))'],
  [
    'calc(var(--10-10px,calc(-20px-(-30px--40px)-50px)',
    'calc(var(--10-10px,calc(-20px - (-30px - -40px) - 50px)',
  ],
  ['calc(theme(spacing.1-bar))', 'calc(theme(spacing.1-bar))'],
  ['theme(spacing.1-bar)', 'theme(spacing.1-bar)'],
  ['calc(theme(spacing.1-bar))', 'calc(theme(spacing.1-bar))'],
  ['calc(1rem-theme(spacing.1-bar))', 'calc(1rem - theme(spacing.1-bar))'],
  ['calc(theme(spacing.foo-2))', 'calc(theme(spacing.foo-2))'],
  ['calc(theme(spacing.foo-bar))', 'calc(theme(spacing.foo-bar))'],

  // A negative number immediately after a `,` should not have spaces inserted
  ['clamp(-3px+4px,-3px+4px,-3px+4px)', 'clamp(-3px + 4px,-3px + 4px,-3px + 4px)'],

  // Prevent formatting inside `var()` functions
  ['calc(var(--foo-bar-bar)*2)', 'calc(var(--foo-bar-bar) * 2)'],

  // Prevent formatting inside `env()` functions
  ['calc(env(safe-area-inset-bottom)*2)', 'calc(env(safe-area-inset-bottom) * 2)'],
  // Should format inside `calc()` nested in `env()`
  ['env(safe-area-inset-bottom,calc(10px+20px))', 'env(safe-area-inset-bottom,calc(10px + 20px))'],
  [
    'calc(env(safe-area-inset-bottom,calc(10px+20px))+5px)',
    'calc(env(safe-area-inset-bottom,calc(10px + 20px)) + 5px)',
  ],

  // Prevent formatting keywords
  ['minmax(min-content,25%)', 'minmax(min-content,25%)'],

  // Prevent formatting keywords
  [
    'radial-gradient(calc(1+2)),radial-gradient(calc(1+2))',
    'radial-gradient(calc(1 + 2)),radial-gradient(calc(1 + 2))',
  ],
  [
    '[content-start]_calc(100%-1px)_[content-end]_minmax(1rem,1fr)',
    '[content-start] calc(100% - 1px) [content-end] minmax(1rem,1fr)',
  ],

  // Misc
  ['color(0_0_0/1.0)', 'color(0 0 0/1.0)'],
  ['color(0_0_0_/_1.0)', 'color(0 0 0 / 1.0)'],
]

it.each(table)('normalize data: %s', (input, output) => {
  expect(normalize(input)).toBe(output)
})

it('should not automatically inject the `var()` for properties that accept `<dashed-ident>` as the value', () => {
  let config = {
    content: [
      // Automatic var injection
      { raw: '[color:--foo]' },

      // Automatic var injection is skipped
      { raw: '[scroll-timeline-name:--foo]' },
      { raw: '[timeline-scope:--foo]' },
      { raw: '[view-timeline-name:--foo]' },
      { raw: '[font-palette:--foo]' },
      { raw: '[anchor-name:--foo]' },
      { raw: '[anchor-scope:--foo]' },
      { raw: '[position-anchor:--foo]' },
      { raw: '[position-try-options:--foo]' },
      { raw: '[scroll-timeline:--foo]' },
      { raw: '[animation-timeline:--foo]' },
      { raw: '[view-timeline:--foo]' },
      { raw: '[position-try:--foo]' },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .\[anchor-name\:--foo\] {
        anchor-name: --foo;
      }
      .\[anchor-scope\:--foo\] {
        anchor-scope: --foo;
      }
      .\[animation-timeline\:--foo\] {
        animation-timeline: --foo;
      }
      .\[color\:--foo\] {
        color: var(--foo);
      }
      .\[font-palette\:--foo\] {
        font-palette: --foo;
      }
      .\[position-anchor\:--foo\] {
        position-anchor: --foo;
      }
      .\[position-try-options\:--foo\] {
        position-try-options: --foo;
      }
      .\[position-try\:--foo\] {
        position-try: --foo;
      }
      .\[scroll-timeline-name\:--foo\] {
        scroll-timeline-name: --foo;
      }
      .\[scroll-timeline\:--foo\] {
        scroll-timeline: --foo;
      }
      .\[timeline-scope\:--foo\] {
        timeline-scope: --foo;
      }
      .\[view-timeline-name\:--foo\] {
        view-timeline-name: --foo;
      }
      .\[view-timeline\:--foo\] {
        view-timeline: --foo;
      }
    `)
  })
})
