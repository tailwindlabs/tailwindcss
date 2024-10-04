import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { describe, expect, test } from 'vitest'
import { extractRawCandidates, printCandidate, replaceCandidateInContent } from './candidates'

let html = String.raw

test('extracts candidates with positions from a template', async () => {
  let content = html`
    <div class="bg-blue-500 hover:focus:text-white [color:red]">
      <button class="bg-blue-500 text-white">My button</button>
    </div>
  `
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  let candidates = await extractRawCandidates(content, 'html')
  let validCandidates = candidates.filter(
    ({ rawCandidate }) => designSystem.parseCandidate(rawCandidate).length > 0,
  )

  expect(validCandidates).toMatchInlineSnapshot(`
    [
      {
        "end": 28,
        "rawCandidate": "bg-blue-500",
        "start": 17,
      },
      {
        "end": 51,
        "rawCandidate": "hover:focus:text-white",
        "start": 29,
      },
      {
        "end": 63,
        "rawCandidate": "[color:red]",
        "start": 52,
      },
      {
        "end": 98,
        "rawCandidate": "bg-blue-500",
        "start": 87,
      },
      {
        "end": 109,
        "rawCandidate": "text-white",
        "start": 99,
      },
    ]
  `)
})

test('replaces the right positions for a candidate', async () => {
  let content = html`
    <h1>🤠👋</h1>
    <div class="bg-blue-500" />
  `

  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  let candidates = await extractRawCandidates(content, 'html')

  let candidate = candidates.find(
    ({ rawCandidate }) => designSystem.parseCandidate(rawCandidate).length > 0,
  )!

  expect(replaceCandidateInContent(content, 'flex', candidate.start, candidate.end))
    .toMatchInlineSnapshot(`
      "
          <h1>🤠👋</h1>
          <div class="flex" />
        "
    `)
})

const candidates = [
  // Arbitrary candidates
  ['[color:red]', '[color:red]'],
  ['[color:red]/50', '[color:red]/50'],
  ['[color:red]/[0.5]', '[color:red]/[0.5]'],
  ['[color:red]/50!', '[color:red]/50!'],
  ['![color:red]/50', '[color:red]/50!'],
  ['[color:red]/[0.5]!', '[color:red]/[0.5]!'],

  // Static candidates
  ['box-border', 'box-border'],
  ['underline!', 'underline!'],
  ['!underline', 'underline!'],
  ['-inset-full', '-inset-full'],

  // Functional candidates
  ['bg-red-500', 'bg-red-500'],
  ['bg-red-500/50', 'bg-red-500/50'],
  ['bg-red-500/[0.5]', 'bg-red-500/[0.5]'],
  ['bg-red-500!', 'bg-red-500!'],
  ['!bg-red-500', 'bg-red-500!'],
  ['bg-[#0088cc]/50', 'bg-[#0088cc]/50'],
  ['bg-[#0088cc]/[0.5]', 'bg-[#0088cc]/[0.5]'],
  ['bg-[#0088cc]!', 'bg-[#0088cc]!'],
  ['!bg-[#0088cc]', 'bg-[#0088cc]!'],
  ['w-1/2', 'w-1/2'],
]

const variants = [
  '', // no variant
  '*:',
  'focus:',
  'group-focus:',

  'hover:focus:',
  'hover:group-focus:',
  'group-hover:focus:',
  'group-hover:group-focus:',

  'min-[10px]:',
  // TODO: This currently expands `calc(1000px+12em)` to `calc(1000px_+_12em)`
  'min-[calc(1000px_+_12em)]:',

  'peer-[&_p]:',
  'peer-[&_p]:hover:',
  'hover:peer-[&_p]:',
  'hover:peer-[&_p]:focus:',
  'peer-[&:hover]:peer-[&_p]:',
]

let combinations: [string, string][] = []
for (let variant of variants) {
  for (let [input, output] of candidates) {
    combinations.push([`${variant}${input}`, `${variant}${output}`])
  }
}

describe('printCandidate()', () => {
  test.each(combinations)('%s', async (candidate: string, result: string) => {
    let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
      base: __dirname,
    })

    let candidates = designSystem.parseCandidate(candidate)

    // Sometimes we will have a functional and a static candidate for the same
    // raw input string (e.g. `-inset-full`). Dedupe in this case.
    let cleaned = new Set([...candidates].map((c) => printCandidate(designSystem, c)))

    expect([...cleaned]).toEqual([result])
  })
})
