// Compile the changelog fragments in `.changelog/` into `CHANGELOG.md`.
//
// Each pull request adds its changelog entries in a file of its own, so pull
// requests don't conflict with each other in `CHANGELOG.md`. See
// `.changelog/README.md` for the format of a fragment.
//
// Usage:
//
//   node ./scripts/changelog.mjs                           Print `CHANGELOG.md` with the fragments in `[Unreleased]`
//   node ./scripts/changelog.mjs check                     Validate the fragments
//   node ./scripts/changelog.mjs release <version> [date]  Move the fragments into a `## [<version>] - <date>` section

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __filename = url.fileURLToPath(import.meta.url)
const root = path.resolve(path.dirname(__filename), '..')

const FRAGMENTS_DIR = '.changelog'
const REPO_URL = 'https://github.com/tailwindlabs/tailwindcss'
const NOTHING_YET = '- Nothing yet!'

// The order of the sections in a release. This is the order that most of the
// existing releases use, which differs from the order of Keep a Changelog.
export const SECTIONS = ['Added', 'Fixed', 'Changed', 'Deprecated', 'Removed', 'Security']

// Print the full `CHANGELOG.md`, with the entries of the fragments in the
// `[Unreleased]` section.
export function preview(changelog, fragments) {
  let { head, body, tail } = compile(changelog, fragments)

  return join([head, '## [Unreleased]', body || NOTHING_YET, tail])
}

// Move the entries of `[Unreleased]` and of the fragments into a new
// `## [<version>] - <date>` section, and start a new `[Unreleased]` section.
export function release(changelog, fragments, { version, date }) {
  version = version.replace(/^v/, '')
  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`Expected a version like \`4.3.4\`, got \`${version}\`.`)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Expected a date like \`2026-10-17\`, got \`${date}\`.`)
  }

  let { head, intro, body, tail } = compile(changelog, fragments)

  if (!body) {
    throw new Error('There are no changes to release.')
  }
  if (tail.split('\n').some((line) => line.startsWith(`## [${version}]`))) {
    throw new Error(`CHANGELOG.md already has a \`## [${version}]\` section.`)
  }

  let link = /^\[unreleased\]: (\S+)\/compare\/(\S+)\.\.\.HEAD$/im.exec(tail)
  if (!link) {
    throw new Error('CHANGELOG.md: Cannot find the `[unreleased]: …/compare/<tag>...HEAD` link.')
  }
  let [line, base, previous] = link
  tail = tail.replace(
    line,
    () =>
      `[unreleased]: ${base}/compare/v${version}...HEAD\n` +
      `[${version}]: ${base}/compare/${previous}...v${version}`,
  )

  // The intro of `[Unreleased]` (e.g. the link to the preview) stays in the
  // new `[Unreleased]` section.
  return join([
    head,
    '## [Unreleased]',
    intro || NOTHING_YET,
    `## [${version}] - ${date}`,
    body,
    tail,
  ])
}

// Read the fragments in `.changelog/`. With `git`, each fragment also gets the
// commit that added it, to sort the entries and to link the pull request.
export function loadFragments(root, { git = true } = {}) {
  let entries
  try {
    entries = fs.readdirSync(path.join(root, FRAGMENTS_DIR), { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }

  let commits = git ? findCommits(root) : new Map()

  return entries
    .filter((entry) => entry.name !== 'README.md' && !entry.name.startsWith('.'))
    .map((entry) => {
      let file = `${FRAGMENTS_DIR}/${entry.name}`
      let content = entry.isFile()
        ? fs.readFileSync(path.join(root, file), 'utf8').replaceAll('\r\n', '\n')
        : null

      return { file, content, ...commits.get(file) }
    })
}

// Find the newest commit that added each fragment. The repository only allows
// squash merges, so the subject of that commit ends with the number of the
// pull request, e.g. `Fix the thing (#12345)`.
function findCommits(root) {
  let output
  try {
    output = execFileSync(
      'git',
      [
        '-c',
        'core.quotePath=false',
        'log',
        '--diff-filter=A',
        '--no-renames',
        '--format=%x00%ct %s',
        '--name-only',
        '--',
        FRAGMENTS_DIR,
      ],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    )
  } catch {
    return new Map()
  }

  let commits = new Map()
  for (let [order, chunk] of output.split('\0').slice(1).entries()) {
    let [header, ...files] = chunk.split('\n')
    let [, time, subject] = /^(\d+) (.*)$/.exec(header)
    let pr = /\(#(\d+)\)$/.exec(subject.trim())?.[1]

    for (let file of files) {
      if (file === '' || commits.has(file)) continue
      commits.set(file, { time: Number(time), order, pr: pr ? Number(pr) : null })
    }
  }

  return commits
}

// Merge the entries that are already in `[Unreleased]` with the entries of the
// fragments. The preview and the release both use this, so the preview shows
// exactly what the release writes.
function compile(changelog, fragments) {
  let { head, intro, sections, tail, errors } = parseChangelog(changelog.replaceAll('\r\n', '\n'))

  for (let fragment of [...fragments].sort(compareFragments)) {
    if (fragment.content === null || !fragment.file.endsWith('.md')) {
      errors.push(`${fragment.file}: Write each fragment as a \`.md\` file in \`.changelog/\`.`)
      continue
    }

    let parsed = parseSections(fragment.content, fragment.file)
    errors.push(...parsed.errors)

    if (parsed.sections.size === 0 && parsed.errors.length === 0) {
      errors.push(`${fragment.file}: The fragment has no entries.`)
    }

    for (let [name, entries] of parsed.sections) {
      for (let entry of entries) {
        sections.get(name).push(withPullRequest(entry, fragment.pr))
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      [
        'Found problems in the changelog:',
        ...errors.map((error) => `  ${error}`),
        'See `.changelog/README.md` for the format.',
      ].join('\n'),
    )
  }

  let body = SECTIONS.filter((name) => sections.get(name).length > 0)
    .map((name) => `### ${name}\n\n${sections.get(name).join('\n')}`)
    .join('\n\n')

  return { head, intro, body, tail }
}

// The order in which the pull requests merged: by the date of the commit that
// added the fragment. Fragments that aren't committed yet go last.
function compareFragments(a, b) {
  return (
    (a.time ?? Number.MAX_SAFE_INTEGER) - (b.time ?? Number.MAX_SAFE_INTEGER) ||
    (b.order ?? 0) - (a.order ?? 0) ||
    (a.file < b.file ? -1 : a.file > b.file ? 1 : 0)
  )
}

// Split `CHANGELOG.md` around the `[Unreleased]` section. The lines before its
// first `###` heading are the intro, e.g. the link to the preview.
function parseChangelog(changelog) {
  let lines = changelog.split('\n')

  let start = lines.findIndex((line) => /^## \[Unreleased\]\s*$/i.test(line))
  if (start === -1) {
    throw new Error('CHANGELOG.md: Cannot find the `## [Unreleased]` section.')
  }

  let end = lines.findIndex(
    (line, idx) => idx > start && (line.startsWith('## ') || /^\[[^\]]+\]: /.test(line)),
  )
  if (end === -1) end = lines.length

  let body = lines.slice(start + 1, end)
  let first = body.findIndex((line) => line.startsWith('### '))
  if (first === -1) first = body.length

  let { sections, errors } = parseSections(
    body.slice(first).join('\n'),
    'CHANGELOG.md',
    start + 1 + first,
  )

  return {
    head: lines.slice(0, start).join('\n'),
    intro: body
      .slice(0, first)
      .filter((line) => line.trim() !== NOTHING_YET)
      .join('\n'),
    sections: new Map(SECTIONS.map((name) => [name, sections.get(name) ?? []])),
    tail: lines.slice(end).join('\n'),
    errors,
  }
}

// Parse `### <Section>` headings, each followed by `- <entry>` lines.
function parseSections(text, file, offset = 0) {
  let sections = new Map()
  let errors = []
  let headings = []
  let current = null

  for (let [idx, line] of text.split('\n').entries()) {
    let location = `${file}:${offset + idx + 1}`
    line = line.trimEnd()

    if (line === '') continue

    let heading = /^###\s+(.+)$/.exec(line)
    if (heading) {
      current = { name: heading[1].trim(), location, entries: 0 }
      headings.push(current)

      if (!SECTIONS.includes(current.name)) {
        errors.push(
          `${location}: Unknown section \`### ${current.name}\`. Use one of: ${SECTIONS.map((name) => `\`### ${name}\``).join(', ')}.`,
        )
      }
      continue
    }

    if (current === null) {
      errors.push(`${location}: Add a section like \`### Fixed\` before the first entry.`)
      current = { name: null, location, entries: 1 }
      continue
    }

    if (!/^- \S/.test(line)) {
      errors.push(`${location}: Expected an entry that starts with \`- \`, got \`${line}\`.`)
      current.entries++
      continue
    }

    current.entries++
    if (!SECTIONS.includes(current.name)) continue

    let entries = sections.get(current.name) ?? []
    entries.push(line)
    sections.set(current.name, entries)
  }

  for (let heading of headings) {
    if (heading.entries === 0) {
      errors.push(`${heading.location}: The section \`### ${heading.name}\` has no entries.`)
    }
  }

  return { sections, errors }
}

// Add a link to the pull request that added the fragment, unless the entry
// already links to a pull request or an issue.
function withPullRequest(entry, pr) {
  if (!pr || /\[#\d+\]\([^)\s]+\)/.test(entry)) return entry

  return `${entry} ([#${pr}](${REPO_URL}/pull/${pr}))`
}

function join(blocks) {
  return (
    blocks
      .map((block) => block.trim())
      .filter(Boolean)
      .join('\n\n') + '\n'
  )
}

function today() {
  let now = new Date()

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
}

function main([command = 'preview', ...args]) {
  let changelogPath = path.join(root, 'CHANGELOG.md')
  let changelog = fs.readFileSync(changelogPath, 'utf8')

  switch (command) {
    case 'preview': {
      process.stdout.write(preview(changelog, loadFragments(root)))
      break
    }

    case 'check': {
      let fragments = loadFragments(root, { git: false })
      preview(changelog, fragments)
      console.log(
        `Checked \`CHANGELOG.md\` and ${fragments.length} fragment(s) in \`.changelog/\`.`,
      )
      break
    }

    case 'release': {
      let [version, date = today()] = args
      if (!version) {
        throw new Error('Usage: node ./scripts/changelog.mjs release <version> [date]')
      }

      let fragments = loadFragments(root)
      fs.writeFileSync(changelogPath, release(changelog, fragments, { version, date }))
      for (let fragment of fragments) {
        fs.rmSync(path.join(root, fragment.file))
      }

      console.log(
        `Moved ${fragments.length} fragment(s) into \`## [${version.replace(/^v/, '')}] - ${date}\` in \`CHANGELOG.md\`.`,
      )
      break
    }

    default: {
      throw new Error(`Unknown command \`${command}\`. Use \`preview\`, \`check\` or \`release\`.`)
    }
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === __filename) {
  try {
    main(process.argv.slice(2))
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
