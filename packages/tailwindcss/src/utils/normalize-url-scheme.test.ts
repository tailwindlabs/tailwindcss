import { expect, it } from 'vitest'
import { normalizeUrlScheme } from './normalize-url-scheme'

it.each([
  // Schemes are case-insensitive
  ['HTTPS://example.com/A.png', 'https://example.com/A.png'],
  ['HtTp://Example.com/Path?Query#Fragment', 'http://Example.com/Path?Query#Fragment'],
  ['DATA:image/svg+xml;base64,PHN2Zz4=', 'data:image/svg+xml;base64,PHN2Zz4='],
  ['Foo-Bar+1.x:y', 'foo-bar+1.x:y'],

  // The rest of the URL stays as written
  ['https://example.com/A.png', 'https://example.com/A.png'],
  ['./HTTP-Styles.css', './HTTP-Styles.css'],
  ['/Images/A.png', '/Images/A.png'],
  ['//CDN.example.com/A.png', '//CDN.example.com/A.png'],
  ['#Fragment', '#Fragment'],
  ['Images/A:B.png', 'Images/A:B.png'],
  ['HTTPS', 'HTTPS'],
  ['', ''],

  // A scheme has to start with a letter, and only contain letters, digits,
  // `+`, `-` and `.`
  ['1HTTP://example.com', '1HTTP://example.com'],
  ['-HTTP://example.com', '-HTTP://example.com'],
  ['HT_TP://example.com', 'HT_TP://example.com'],
  ['ÄBC://example.com', 'ÄBC://example.com'],

  // A single letter is a Windows drive
  ['C:/Styles/App.css', 'C:/Styles/App.css'],
  ['C:\\Styles\\App.css', 'C:\\Styles\\App.css'],
])('%s', (input, output) => {
  expect(normalizeUrlScheme(input)).toBe(output)
})
