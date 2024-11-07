import { expect, it } from 'vitest'
import { hoistStaticGlobParts } from './hoist-static-glob-parts'

it.each([
  // A basic glob
  [
    { base: '/projects/project-a', pattern: './src/**/*.html' },
    [{ base: '/projects/project-a/src', pattern: '**/*.html' }],
  ],

  // A glob pointing to a folder should result in `**/*`
  [
    { base: '/projects/project-a', pattern: './src' },
    [{ base: '/projects/project-a/src', pattern: '**/*' }],
  ],

  // A glob pointing to a file, should result in the file as the pattern
  [
    { base: '/projects/project-a', pattern: './src/index.html' },
    [{ base: '/projects/project-a/src', pattern: 'index.html' }],
  ],

  // A glob going up a directory, should result in the new directory as the base
  [
    { base: '/projects/project-a', pattern: '../project-b/src/**/*.html' },
    [{ base: '/projects/project-b/src', pattern: '**/*.html' }],
  ],

  // A glob with curlies, should be expanded to multiple globs
  [
    { base: '/projects/project-a', pattern: '../project-{b,c}/src/**/*.html' },
    [
      { base: '/projects/project-b/src', pattern: '**/*.html' },
      { base: '/projects/project-c/src', pattern: '**/*.html' },
    ],
  ],
  [
    { base: '/projects/project-a', pattern: '../project-{b,c}/src/**/*.{js,html}' },
    [
      { base: '/projects/project-b/src', pattern: '**/*.js' },
      { base: '/projects/project-b/src', pattern: '**/*.html' },
      { base: '/projects/project-c/src', pattern: '**/*.js' },
      { base: '/projects/project-c/src', pattern: '**/*.html' },
    ],
  ],
])('should hoist the static parts of the glob: %s', (input, output) => {
  expect(hoistStaticGlobParts(input)).toEqual(output)
})
