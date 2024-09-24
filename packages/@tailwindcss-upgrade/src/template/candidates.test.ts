import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { describe, expect, test } from 'vitest'
import { parseCandidate } from '../../../tailwindcss/src/candidate'
import { extractCandidates, printCandidate } from './candidates'

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

  expect(extractCandidates(designSystem, content)).resolves.toMatchInlineSnapshot(`
    [
      {
        "candidate": {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "negative": false,
          "raw": "bg-blue-500",
          "root": "bg",
          "value": {
            "fraction": null,
            "kind": "named",
            "value": "blue-500",
          },
          "variants": [],
        },
        "end": 28,
        "start": 17,
      },
      {
        "candidate": {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "negative": false,
          "raw": "hover:focus:text-white",
          "root": "text",
          "value": {
            "fraction": null,
            "kind": "named",
            "value": "white",
          },
          "variants": [
            {
              "compounds": true,
              "kind": "static",
              "root": "focus",
            },
            {
              "compounds": true,
              "kind": "static",
              "root": "hover",
            },
          ],
        },
        "end": 51,
        "start": 29,
      },
      {
        "candidate": {
          "important": false,
          "kind": "arbitrary",
          "modifier": null,
          "property": "color",
          "raw": "[color:red]",
          "value": "red",
          "variants": [],
        },
        "end": 63,
        "start": 52,
      },
      {
        "candidate": {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "negative": false,
          "raw": "bg-blue-500",
          "root": "bg",
          "value": {
            "fraction": null,
            "kind": "named",
            "value": "blue-500",
          },
          "variants": [],
        },
        "end": 98,
        "start": 87,
      },
      {
        "candidate": {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "negative": false,
          "raw": "text-white",
          "root": "text",
          "value": {
            "fraction": null,
            "kind": "named",
            "value": "white",
          },
          "variants": [],
        },
        "end": 109,
        "start": 99,
      },
    ]
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

describe('toString()', () => {
  test.each(combinations)('%s', async (candidate: string, result: string) => {
    let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
      base: __dirname,
    })

    let candidates = parseCandidate(candidate, designSystem)

    // Sometimes we will have a functional and a static candidate for the same
    // raw input string (e.g. `-inset-full`). Dedupe in this case.
    // TODO: This seems unexpected?
    let cleaned = new Set([...candidates].map(printCandidate))

    expect([...cleaned]).toEqual([result])
  })
})
