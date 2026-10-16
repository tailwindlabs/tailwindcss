import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import url from 'node:url'
import { describe, expect, onTestFinished, test } from 'vitest'
import { loadFragments, preview, release } from './changelog.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const CHANGELOG = `# Changelog

## [Unreleased]

See the [preview](https://github.com/tailwindlabs/tailwindcss/blob/changelog/CHANGELOG.md#unreleased).

### Fixed

- Fix an existing bug ([#1](https://github.com/tailwindlabs/tailwindcss/pull/1))

## [1.0.0] - 2026-01-01

### Added

- Add everything

[unreleased]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/tailwindlabs/tailwindcss/releases/tag/v1.0.0
`

describe('preview', () => {
  test('adds the entries of the fragments to `[Unreleased]`', () => {
    let fragments = [
      {
        file: '.changelog/b.md',
        content: '### Fixed\n\n- Fix the second bug\n',
        time: 2,
        pr: 3,
      },
      {
        file: '.changelog/a.md',
        content: [
          '### Changed',
          '',
          '- Change a thing',
          '',
          '### Added',
          '',
          '- Add a feature',
          '- Add a feature for an issue ([#4](https://github.com/tailwindlabs/tailwindcss/issues/4))',
          '',
        ].join('\n'),
        time: 1,
        pr: 2,
      },
      {
        file: '.changelog/c.md',
        content: '### Fixed\n\n- Fix a bug that is not committed yet\n',
      },
    ]

    expect(preview(CHANGELOG, fragments)).toMatchInlineSnapshot(`
      "# Changelog

      ## [Unreleased]

      ### Added

      - Add a feature ([#2](https://github.com/tailwindlabs/tailwindcss/pull/2))
      - Add a feature for an issue ([#4](https://github.com/tailwindlabs/tailwindcss/issues/4))

      ### Fixed

      - Fix an existing bug ([#1](https://github.com/tailwindlabs/tailwindcss/pull/1))
      - Fix the second bug ([#3](https://github.com/tailwindlabs/tailwindcss/pull/3))
      - Fix a bug that is not committed yet

      ### Changed

      - Change a thing ([#2](https://github.com/tailwindlabs/tailwindcss/pull/2))

      ## [1.0.0] - 2026-01-01

      ### Added

      - Add everything

      [unreleased]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0...HEAD
      [1.0.0]: https://github.com/tailwindlabs/tailwindcss/releases/tag/v1.0.0
      "
    `)
  })

  test('keeps `CHANGELOG.md` as it is without fragments, except for the intro of `[Unreleased]`', () => {
    expect(preview(CHANGELOG, [])).toEqual(CHANGELOG.replace(/\nSee the \[preview\].*\n/, ''))
  })

  test('shows `- Nothing yet!` without entries', () => {
    let changelog = CHANGELOG.replace(/### Fixed\n\n- Fix an existing bug.*\n\n/, '')

    expect(preview(changelog, [])).toContain('## [Unreleased]\n\n- Nothing yet!\n\n## [1.0.0]')
  })

  test('reports invalid fragments', () => {
    let fragments = [
      { file: '.changelog/empty.md', content: '\n' },
      { file: '.changelog/no-section.md', content: '- Fix a bug\n' },
      { file: '.changelog/unknown.md', content: '### Improved\n\n- Improve a thing\n' },
      { file: '.changelog/bullet.md', content: '### Fixed\n\n* Fix a bug\nMore text\n' },
      { file: '.changelog/no-entries.md', content: '### Added\n\n### Fixed\n\n- Fix a bug\n' },
      { file: '.changelog/notes.txt', content: '### Fixed\n\n- Fix a bug\n' },
      { file: '.changelog/folder', content: null },
    ]

    expect(() => preview(CHANGELOG, fragments)).toThrowErrorMatchingInlineSnapshot(`
      [Error: Found problems in the changelog:
        .changelog/bullet.md:3: Expected an entry that starts with \`- \`, got \`* Fix a bug\`.
        .changelog/bullet.md:4: Expected an entry that starts with \`- \`, got \`More text\`.
        .changelog/empty.md: The fragment has no entries.
        .changelog/folder: Write each fragment as a \`.md\` file in \`.changelog/\`.
        .changelog/no-entries.md:1: The section \`### Added\` has no entries.
        .changelog/no-section.md:1: Add a section like \`### Fixed\` before the first entry.
        .changelog/notes.txt: Write each fragment as a \`.md\` file in \`.changelog/\`.
        .changelog/unknown.md:1: Unknown section \`### Improved\`. Use one of: \`### Added\`, \`### Fixed\`, \`### Changed\`, \`### Deprecated\`, \`### Removed\`, \`### Security\`.
      See \`.changelog/README.md\` for the format.]
    `)
  })

  test('reports invalid entries in `[Unreleased]` of `CHANGELOG.md`', () => {
    let changelog = CHANGELOG.replace('### Fixed', '### Fixes')

    expect(() => preview(changelog, [])).toThrowErrorMatchingInlineSnapshot(`
      [Error: Found problems in the changelog:
        CHANGELOG.md:7: Unknown section \`### Fixes\`. Use one of: \`### Added\`, \`### Fixed\`, \`### Changed\`, \`### Deprecated\`, \`### Removed\`, \`### Security\`.
      See \`.changelog/README.md\` for the format.]
    `)
  })
})

describe('release', () => {
  test('moves the entries into a new release', () => {
    let fragments = [
      { file: '.changelog/a.md', content: '### Added\n\n- Add a feature\n', time: 1, pr: 2 },
    ]

    expect(release(CHANGELOG, fragments, { version: '1.1.0', date: '2026-10-17' }))
      .toMatchInlineSnapshot(`
        "# Changelog

        ## [Unreleased]

        See the [preview](https://github.com/tailwindlabs/tailwindcss/blob/changelog/CHANGELOG.md#unreleased).

        ## [1.1.0] - 2026-10-17

        ### Added

        - Add a feature ([#2](https://github.com/tailwindlabs/tailwindcss/pull/2))

        ### Fixed

        - Fix an existing bug ([#1](https://github.com/tailwindlabs/tailwindcss/pull/1))

        ## [1.0.0] - 2026-01-01

        ### Added

        - Add everything

        [unreleased]: https://github.com/tailwindlabs/tailwindcss/compare/v1.1.0...HEAD
        [1.1.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0...v1.1.0
        [1.0.0]: https://github.com/tailwindlabs/tailwindcss/releases/tag/v1.0.0
        "
      `)
  })

  test('starts `[Unreleased]` with `- Nothing yet!` without an intro', () => {
    let changelog = CHANGELOG.replace(/\nSee the \[preview\].*\n/, '')

    expect(release(changelog, [], { version: 'v1.1.0', date: '2026-10-17' })).toContain(
      '## [Unreleased]\n\n- Nothing yet!\n\n## [1.1.0] - 2026-10-17\n\n### Fixed',
    )
  })

  test('reports problems', () => {
    let options = { version: '1.1.0', date: '2026-10-17' }
    let empty = CHANGELOG.replace(/### Fixed\n\n- Fix an existing bug.*\n\n/, '')

    expect(() => release(CHANGELOG, [], { ...options, version: '1.1' })).toThrowError(
      'Expected a version like `4.3.4`, got `1.1`.',
    )
    expect(() => release(CHANGELOG, [], { ...options, date: '17/10/2026' })).toThrowError(
      'Expected a date like `2026-10-17`, got `17/10/2026`.',
    )
    expect(() => release(CHANGELOG, [], { ...options, version: '1.0.0' })).toThrowError(
      'CHANGELOG.md already has a `## [1.0.0]` section.',
    )
    expect(() => release(empty, [], options)).toThrowError('There are no changes to release.')
  })
})

describe('git', () => {
  test('sorts fragments by the commit that added them, and links its pull request', () => {
    let dir = tmpdir()
    git(dir, ['init', '--quiet'])

    write(dir, '.changelog/README.md', '# Changelog fragments\n')
    write(dir, '.changelog/z.md', '### Fixed\n\n- Fix the first bug\n')
    git(dir, ['add', '.'])
    git(dir, ['commit', '--quiet', '-m', 'Fix the first bug (#10)'], '2026-01-01T00:00:00Z')

    write(dir, '.changelog/a.md', '### Fixed\n\n- Fix the second bug\n')
    git(dir, ['add', '.'])
    git(dir, ['commit', '--quiet', '-m', 'Fix the second bug'], '2026-01-02T00:00:00Z')

    write(dir, '.changelog/m.md', '### Fixed\n\n- Fix the third bug\n')

    let output = preview(CHANGELOG, loadFragments(dir))

    expect(output.slice(output.indexOf('### Fixed'), output.indexOf('## [1.0.0]')))
      .toMatchInlineSnapshot(`
        "### Fixed

        - Fix an existing bug ([#1](https://github.com/tailwindlabs/tailwindcss/pull/1))
        - Fix the first bug ([#10](https://github.com/tailwindlabs/tailwindcss/pull/10))
        - Fix the second bug
        - Fix the third bug

        "
      `)
  })

  test('`release` writes `CHANGELOG.md` for `scripts/release-notes.mjs`, and deletes the fragments', () => {
    let dir = tmpdir()
    git(dir, ['init', '--quiet'])

    for (let script of ['changelog.mjs', 'release-notes.mjs']) {
      write(dir, `scripts/${script}`, fs.readFileSync(path.join(__dirname, script), 'utf8'))
    }
    write(dir, 'CHANGELOG.md', CHANGELOG)
    write(dir, '.changelog/README.md', '# Changelog fragments\n')
    write(dir, '.changelog/feature.md', '### Added\n\n- Add a feature\n')
    git(dir, ['add', '.'])
    git(dir, ['commit', '--quiet', '-m', 'Add a feature (#20)'])

    node(dir, ['scripts/changelog.mjs', 'release', '1.1.0', '2026-10-17'])

    expect(fs.readdirSync(path.join(dir, '.changelog'))).toEqual(['README.md'])
    expect(node(dir, ['scripts/release-notes.mjs', '1.1.0'])).toMatchInlineSnapshot(`
      "### Added

      - Add a feature ([#20](https://github.com/tailwindlabs/tailwindcss/pull/20))

      ### Fixed

      - Fix an existing bug ([#1](https://github.com/tailwindlabs/tailwindcss/pull/1))
      "
    `)
  })
})

function tmpdir() {
  let dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tailwindcss-changelog-')))
  onTestFinished(() => fs.rmSync(dir, { recursive: true, force: true }))
  return dir
}

function write(dir, file, content) {
  fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
  fs.writeFileSync(path.join(dir, file), content)
}

function git(dir, args, date = '2026-01-01T00:00:00Z') {
  execFileSync(
    'git',
    [
      '-c',
      'user.name=Test',
      '-c',
      'user.email=test@example.com',
      '-c',
      'commit.gpgsign=false',
      ...args,
    ],
    { cwd: dir, env: { ...gitlessEnv(), GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } },
  )
}

function node(dir, args) {
  return execFileSync(process.execPath, args, { cwd: dir, encoding: 'utf8', env: gitlessEnv() })
}

// Don't let `GIT_DIR` and the like of a Git hook point the commands at this
// repository.
function gitlessEnv() {
  return Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')))
}
