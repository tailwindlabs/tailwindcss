import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { spliceChangesIntoString } from '../../utils/splice-changes-into-string'
import { extractRawCandidates } from './candidates'

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

  let migrated = spliceChangesIntoString(content, [
    {
      start: candidate.start,
      end: candidate.end,
      replacement: 'flex',
    },
  ])

  expect(migrated).toMatchInlineSnapshot(`
    "
        <h1>🤠👋</h1>
        <div class="flex" />
      "
  `)
})
