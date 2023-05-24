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

  // Misc
  ['color(0_0_0/1.0)', 'color(0 0 0/1.0)'],
  ['color(0_0_0_/_1.0)', 'color(0 0 0 / 1.0)'],
]

it.each(table)('normalize data: %s', (input, output) => {
  expect(normalize(input)).toBe(output)
})
