import { transform } from 'lightningcss'
import { describe, expect, it, test } from 'vitest'
import { __unstable__loadDesignSystem } from '.'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'
import { Utilities } from './utilities'
import { Compounds, Variants } from './variants'

function run(
  candidate: string,
  {
    utilities,
    variants,
    prefix,
  }: { utilities?: Utilities; variants?: Variants; prefix?: string } = {},
) {
  utilities ??= new Utilities()
  variants ??= new Variants()

  let designSystem = buildDesignSystem(new Theme())
  designSystem.theme.prefix = prefix ?? null

  designSystem.utilities = utilities
  designSystem.variants = variants

  return Array.from(designSystem.parseCandidate(candidate))
}

it('should skip unknown utilities', () => {
  expect(run('unknown-utility')).toEqual([])
})

it('should skip unknown variants', () => {
  expect(run('unknown-variant:flex')).toEqual([])
})

it('should parse a simple utility', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  expect(run('flex', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "flex",
        "root": "flex",
        "variants": [],
      },
    ]
  `)
})

it('should parse a simple utility that should be important', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  expect(run('flex!', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": true,
        "kind": "static",
        "raw": "flex!",
        "root": "flex",
        "variants": [],
      },
    ]
  `)
})

it('should parse a simple utility that can be negative', () => {
  let utilities = new Utilities()
  utilities.functional('-translate-x', () => [])

  expect(run('-translate-x-4', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "-translate-x-4",
        "root": "-translate-x",
        "value": {
          "fraction": null,
          "kind": "named",
          "value": "4",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a simple utility with a variant', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.static('hover', () => {})

  expect(run('hover:flex', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "hover:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "static",
            "root": "hover",
          },
        ],
      },
    ]
  `)
})

it('should parse a simple utility with stacked variants', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.static('hover', () => {})
  variants.static('focus', () => {})

  expect(run('focus:hover:flex', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "focus:hover:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "static",
            "root": "hover",
          },
          {
            "kind": "static",
            "root": "focus",
          },
        ],
      },
    ]
  `)
})

it('should parse a simple utility with an arbitrary variant', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  expect(run('[&_p]:flex', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "[&_p]:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "arbitrary",
            "relative": false,
            "selector": "& p",
          },
        ],
      },
    ]
  `)
})

it('should parse an arbitrary variant using the automatic var shorthand', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])
  let variants = new Variants()
  variants.functional('supports', () => {})

  expect(run('supports-(--test):flex', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "supports-(--test):flex",
        "root": "flex",
        "variants": [
          {
            "kind": "functional",
            "modifier": null,
            "root": "supports",
            "value": {
              "kind": "arbitrary",
              "value": "var(--test)",
            },
          },
        ],
      },
    ]
  `)
})

it('should parse a simple utility with a parameterized variant', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.functional('data', () => {})

  expect(run('data-[disabled]:flex', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "data-[disabled]:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "functional",
            "modifier": null,
            "root": "data",
            "value": {
              "kind": "arbitrary",
              "value": "disabled",
            },
          },
        ],
      },
    ]
  `)
})

it('should parse compound variants with an arbitrary value as an arbitrary variant', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.compound('group', Compounds.StyleRules, () => {})

  expect(run('group-[&_p]/parent-name:flex', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "group-[&_p]/parent-name:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "compound",
            "modifier": {
              "kind": "named",
              "value": "parent-name",
            },
            "root": "group",
            "variant": {
              "kind": "arbitrary",
              "relative": false,
              "selector": "& p",
            },
          },
        ],
      },
    ]
  `)
})

it('should parse a simple utility with a parameterized variant and a modifier', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.compound('group', Compounds.StyleRules, () => {})
  variants.functional('aria', () => {})

  expect(run('group-aria-[disabled]/parent-name:flex', { utilities, variants }))
    .toMatchInlineSnapshot(`
      [
        {
          "important": false,
          "kind": "static",
          "raw": "group-aria-[disabled]/parent-name:flex",
          "root": "flex",
          "variants": [
            {
              "kind": "compound",
              "modifier": {
                "kind": "named",
                "value": "parent-name",
              },
              "root": "group",
              "variant": {
                "kind": "functional",
                "modifier": null,
                "root": "aria",
                "value": {
                  "kind": "arbitrary",
                  "value": "disabled",
                },
              },
            },
          ],
        },
      ]
    `)
})

it('should parse compound group with itself group-group-*', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.static('hover', () => {})
  variants.compound('group', Compounds.StyleRules, () => {})

  expect(run('group-group-group-hover/parent-name:flex', { utilities, variants }))
    .toMatchInlineSnapshot(`
      [
        {
          "important": false,
          "kind": "static",
          "raw": "group-group-group-hover/parent-name:flex",
          "root": "flex",
          "variants": [
            {
              "kind": "compound",
              "modifier": {
                "kind": "named",
                "value": "parent-name",
              },
              "root": "group",
              "variant": {
                "kind": "compound",
                "modifier": null,
                "root": "group",
                "variant": {
                  "kind": "compound",
                  "modifier": null,
                  "root": "group",
                  "variant": {
                    "kind": "static",
                    "root": "hover",
                  },
                },
              },
            },
          ],
        },
      ]
    `)
})

it('should not parse variants that nest more than 16 compound variants', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.static('hover', () => {})
  variants.compound('in', Compounds.StyleRules, () => {})

  expect(run(`${'in-'.repeat(16)}hover:flex`, { utilities, variants })).toHaveLength(1)
  expect(run(`${'in-'.repeat(17)}hover:flex`, { utilities, variants })).toEqual([])

  // Long chains should bail early instead of parsing (and recursing) once for
  // each compound variant
  let start = performance.now()
  expect(run(`${'in-'.repeat(10_000)}hover:flex`, { utilities, variants })).toEqual([])
  expect(performance.now() - start).toBeLessThan(1_000)
})

it('should parse nested compound variants the same way, no matter what was parsed before', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.static('hover', () => {})
  variants.compound('in', Compounds.StyleRules, () => {})

  // Parses the candidates in order with the same design system, so parsed
  // variants are cached between them.
  function parse(candidates: string[]) {
    let designSystem = buildDesignSystem(new Theme())
    designSystem.utilities = utilities
    designSystem.variants = variants

    return candidates.map((candidate) => designSystem.parseCandidate(candidate).length)
  }

  // A chain that nests too deep doesn't make the variants inside of it invalid
  expect(
    parse([`${'in-'.repeat(17)}hover:flex`, `${'in-'.repeat(16)}hover:flex`, 'in-hover:flex']),
  ).toEqual([0, 1, 1])

  // A cached variant inside of a chain doesn't make a chain that nests too
  // deep valid
  expect(parse([`${'in-'.repeat(16)}hover:flex`, `${'in-'.repeat(17)}hover:flex`])).toEqual([1, 0])
})

it('should parse a simple utility with an arbitrary media variant', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  expect(run('[@media(width>=123px)]:flex', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "[@media(width>=123px)]:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "arbitrary",
            "relative": false,
            "selector": "@media(width>=123px)",
          },
        ],
      },
    ]
  `)
})

it('should skip arbitrary variants where @media and other arbitrary variants are combined', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  expect(run('[@media(width>=123px){&:hover}]:flex', { utilities })).toMatchInlineSnapshot(`[]`)
})

it('should parse a utility with a modifier', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-red-500/50', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": {
          "kind": "named",
          "value": "50",
        },
        "raw": "bg-red-500/50",
        "root": "bg",
        "value": {
          "fraction": "red-500/50",
          "kind": "named",
          "value": "red-500",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with an arbitrary modifier', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-red-500/[50%]', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": {
          "kind": "arbitrary",
          "value": "50%",
        },
        "raw": "bg-red-500/[50%]",
        "root": "bg",
        "value": {
          "fraction": null,
          "kind": "named",
          "value": "red-500",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with a modifier that is important', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-red-500/50!', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": true,
        "kind": "functional",
        "modifier": {
          "kind": "named",
          "value": "50",
        },
        "raw": "bg-red-500/50!",
        "root": "bg",
        "value": {
          "fraction": "red-500/50",
          "kind": "named",
          "value": "red-500",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with a modifier and a variant', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  let variants = new Variants()
  variants.static('hover', () => {})

  expect(run('hover:bg-red-500/50', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": {
          "kind": "named",
          "value": "50",
        },
        "raw": "hover:bg-red-500/50",
        "root": "bg",
        "value": {
          "fraction": "red-500/50",
          "kind": "named",
          "value": "red-500",
        },
        "variants": [
          {
            "kind": "static",
            "root": "hover",
          },
        ],
      },
    ]
  `)
})

it('should not parse a partial utility', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])
  utilities.functional('bg', () => [])

  expect(run('flex-', { utilities })).toMatchInlineSnapshot(`[]`)
  expect(run('bg-', { utilities })).toMatchInlineSnapshot(`[]`)
})

it('should not parse static utilities with a modifier', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  expect(run('flex/foo', { utilities })).toMatchInlineSnapshot(`[]`)
})

it('should not parse static utilities with multiple modifiers', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  expect(run('flex/foo/bar', { utilities })).toMatchInlineSnapshot(`[]`)
})

it('should not parse functional utilities with multiple modifiers', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-red-1/2/3', { utilities })).toMatchInlineSnapshot(`[]`)
  expect(run('bg-red-500/50/', { utilities })).toMatchInlineSnapshot(`[]`)
  expect(run('bg-red-500/50//foo', { utilities })).toMatchInlineSnapshot(`[]`)
})

it('should parse a utility with an arbitrary value', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-[#0088cc]', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "bg-[#0088cc]",
        "root": "bg",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "#0088cc",
        },
        "variants": [],
      },
    ]
  `)
})

it('should not parse a utility with an incomplete arbitrary value', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-[#0088cc', { utilities })).toMatchInlineSnapshot(`[]`)
})

it('should parse a utility with an arbitrary value with parens', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-(--my-color)', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "bg-(--my-color)",
        "root": "bg",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "var(--my-color)",
        },
        "variants": [],
      },
    ]
  `)
})

describe('arbitrary values with unbalanced parens or brackets', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])
  utilities.functional('w', () => [])
  utilities.functional('bg', () => [])
  let variants = new Variants()
  variants.functional('data', () => {})

  it.each([
    // Utility values
    'w-[calc(1px]',
    'w-[(]',
    'w-[calc(1px+(2px]',
    'w-[1px)]',
    'w-[calc(1px))]',
    'w-[a(b]c)]',
    'w-[var(--a,[1px)]',
    'w-[var(--a,[1px]',

    // A `}` at the top-level is invalid. `{` is not tracked on the stack,
    // otherwise `[&{color:red}]:flex` would become valid.
    'w-[{}]',

    // Arbitrary properties
    '[width:calc(1px]',

    // Arbitrary modifiers
    'bg-red-500/[calc(1]',

    // Arbitrary variants
    '[&:is(.a]:flex',

    // Functional variants
    'data-[foo(]:flex',
  ])('should not parse `%s`', (candidate) => {
    expect(run(candidate, { utilities, variants })).toEqual([])
  })

  it.each([
    'w-[calc(1px+(2px*3))]',
    "w-[calc(1px+var(--a,'('))]",
    'w-[var(--a,[1px])]',

    // A `}` inside parens is tolerated, because `{` is not tracked on the stack
    'w-[var(--a,{})]',
  ])('should parse `%s`', (candidate) => {
    expect(run(candidate, { utilities, variants })).not.toEqual([])
  })
})

it('should not parse a utility with an arbitrary value with parens that does not start with --', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-(my-color)', { utilities })).toMatchInlineSnapshot(`[]`)
})

it('should parse a utility with an arbitrary value including a typehint', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-[color:var(--value)]', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "bg-[color:var(--value)]",
        "root": "bg",
        "value": {
          "dataType": "color",
          "kind": "arbitrary",
          "value": "var(--value)",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with an arbitrary value with parens including a typehint', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-(color:--my-color)', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "bg-(color:--my-color)",
        "root": "bg",
        "value": {
          "dataType": "color",
          "kind": "arbitrary",
          "value": "var(--my-color)",
        },
        "variants": [],
      },
    ]
  `)
})

it('should not parse a utility with an arbitrary value with parens including a typehint that does not start with --', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-(color:my-color)', { utilities })).toMatchInlineSnapshot(`[]`)
})

it('should parse a utility with an arbitrary value with parens and a fallback', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-(color:--my-color,#0088cc)', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "bg-(color:--my-color,#0088cc)",
        "root": "bg",
        "value": {
          "dataType": "color",
          "kind": "arbitrary",
          "value": "var(--my-color,#0088cc)",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with an arbitrary value with a modifier', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-[#0088cc]/50', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": {
          "kind": "named",
          "value": "50",
        },
        "raw": "bg-[#0088cc]/50",
        "root": "bg",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "#0088cc",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with an arbitrary value with an arbitrary modifier', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-[#0088cc]/[50%]', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": {
          "kind": "arbitrary",
          "value": "50%",
        },
        "raw": "bg-[#0088cc]/[50%]",
        "root": "bg",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "#0088cc",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with an arbitrary value that is important', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-[#0088cc]!', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": true,
        "kind": "functional",
        "modifier": null,
        "raw": "bg-[#0088cc]!",
        "root": "bg",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "#0088cc",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with an implicit variable as the arbitrary value', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-[var(--value)]', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "bg-[var(--value)]",
        "root": "bg",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "var(--value)",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with an implicit variable as the arbitrary value that is important', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-[var(--value)]!', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": true,
        "kind": "functional",
        "modifier": null,
        "raw": "bg-[var(--value)]!",
        "root": "bg",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "var(--value)",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with an explicit variable as the arbitrary value', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-[var(--value)]', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "bg-[var(--value)]",
        "root": "bg",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "var(--value)",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with an explicit variable as the arbitrary value that is important', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-[var(--value)]!', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": true,
        "kind": "functional",
        "modifier": null,
        "raw": "bg-[var(--value)]!",
        "root": "bg",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "var(--value)",
        },
        "variants": [],
      },
    ]
  `)
})

it('should not parse invalid arbitrary values', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  for (let candidate of [
    'bg-red-[#0088cc]',
    'bg-red[#0088cc]',

    'bg-red-[color:var(--value)]',
    'bg-red[color:var(--value)]',

    'bg-red-[#0088cc]/50',
    'bg-red[#0088cc]/50',

    'bg-red-[#0088cc]/[50%]',
    'bg-red[#0088cc]/[50%]',

    'bg-red-[#0088cc]!',
    'bg-red[#0088cc]!',

    'bg-red-[var(--value)]',
    'bg-red[var(--value)]',

    'bg-red-[var(--value)]!',
    'bg-red[var(--value)]!',
  ]) {
    expect(run(candidate, { utilities })).toEqual([])
  }
})

it('should not parse invalid arbitrary values in variants', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.functional('data', () => {})

  for (let candidate of [
    'data-foo-[#0088cc]:flex',
    'data-foo[#0088cc]:flex',

    'data-foo-[color:var(--value)]:flex',
    'data-foo[color:var(--value)]:flex',

    'data-foo-[#0088cc]/50:flex',
    'data-foo[#0088cc]/50:flex',

    'data-foo-[#0088cc]/[50%]:flex',
    'data-foo[#0088cc]/[50%]:flex',

    'data-foo-[#0088cc]:flex!',
    'data-foo[#0088cc]:flex!',

    'data-foo-[var(--value)]:flex',
    'data-foo[var(--value)]:flex',

    'data-foo-[var(--value)]:flex!',
    'data-foo[var(--value)]:flex!',

    'data-foo-(color:--value):flex',
    'data-foo(color:--value):flex',

    'data-foo-(color:--value)/50:flex',
    'data-foo(color:--value)/50:flex',

    'data-foo-(color:--value)/(--mod):flex',
    'data-foo(color:--value)/(--mod):flex',

    'data-foo-(color:--value)/(number:--mod):flex',
    'data-foo(color:--value)/(number:--mod):flex',

    'data-foo-(--value):flex',
    'data-foo(--value):flex',

    'data-foo-(--value)/50:flex',
    'data-foo(--value)/50:flex',

    'data-foo-(--value)/(--mod):flex',
    'data-foo(--value)/(--mod):flex',

    'data-foo-(--value)/(number:--mod):flex',
    'data-foo(--value)/(number:--mod):flex',

    'data-(value):flex',
  ]) {
    expect(run(candidate, { utilities, variants })).toEqual([])
  }
})

it('should parse a utility with an implicit variable as the modifier', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-red-500/[var(--value)]', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": {
          "kind": "arbitrary",
          "value": "var(--value)",
        },
        "raw": "bg-red-500/[var(--value)]",
        "root": "bg",
        "value": {
          "fraction": null,
          "kind": "named",
          "value": "red-500",
        },
        "variants": [],
      },
    ]
  `)
})

it('should properly decode escaped underscores but not convert underscores to spaces for CSS variables in arbitrary positions', () => {
  let utilities = new Utilities()
  utilities.functional('flex', () => [])
  let variants = new Variants()
  variants.functional('supports', () => {})

  expect(run('flex-(--\\_foo)', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "flex-(--\\_foo)",
        "root": "flex",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "var(--_foo)",
        },
        "variants": [],
      },
    ]
  `)
  expect(run('flex-(--_foo)', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "flex-(--_foo)",
        "root": "flex",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "var(--_foo)",
        },
        "variants": [],
      },
    ]
  `)
  expect(run('flex-[var(--\\_foo)]', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "flex-[var(--\\_foo)]",
        "root": "flex",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "var(--_foo)",
        },
        "variants": [],
      },
    ]
  `)
  expect(run('flex-[var(--_foo)]', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "flex-[var(--_foo)]",
        "root": "flex",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "var(--_foo)",
        },
        "variants": [],
      },
    ]
  `)

  expect(run('flex-[calc(var(--\\_foo)*0.2)]', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "flex-[calc(var(--\\_foo)*0.2)]",
        "root": "flex",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "calc(var(--_foo) * 0.2)",
        },
        "variants": [],
      },
    ]
  `)
  expect(run('flex-[calc(var(--_foo)*0.2)]', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "flex-[calc(var(--_foo)*0.2)]",
        "root": "flex",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "calc(var(--_foo) * 0.2)",
        },
        "variants": [],
      },
    ]
  `)

  // Due to limitations in the CSS value parser, the `var(…)` inside the `calc(…)` is not correctly
  // scanned here.
  expect(run('flex-[calc(0.2*var(--\\_foo))]', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "flex-[calc(0.2*var(--\\_foo))]",
        "root": "flex",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "calc(0.2 * var(--_foo))",
        },
        "variants": [],
      },
    ]
  `)
  expect(run('flex-[calc(0.2*var(--_foo))]', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "flex-[calc(0.2*var(--_foo))]",
        "root": "flex",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "calc(0.2 * var(-- foo))",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with an implicit variable as the modifier using the shorthand', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  // Standard case (no underscores)
  expect(run('bg-red-500/(--value)', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": {
          "kind": "arbitrary",
          "value": "var(--value)",
        },
        "raw": "bg-red-500/(--value)",
        "root": "bg",
        "value": {
          "fraction": null,
          "kind": "named",
          "value": "red-500",
        },
        "variants": [],
      },
    ]
  `)

  // Should preserve underscores
  expect(run('bg-red-500/(--with_underscore)', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": {
          "kind": "arbitrary",
          "value": "var(--with_underscore)",
        },
        "raw": "bg-red-500/(--with_underscore)",
        "root": "bg",
        "value": {
          "fraction": null,
          "kind": "named",
          "value": "red-500",
        },
        "variants": [],
      },
    ]
  `)

  // Should remove underscores in fallback values
  expect(run('bg-red-500/(--with_underscore,fallback_value)', { utilities }))
    .toMatchInlineSnapshot(`
      [
        {
          "important": false,
          "kind": "functional",
          "modifier": {
            "kind": "arbitrary",
            "value": "var(--with_underscore,fallback value)",
          },
          "raw": "bg-red-500/(--with_underscore,fallback_value)",
          "root": "bg",
          "value": {
            "fraction": null,
            "kind": "named",
            "value": "red-500",
          },
          "variants": [],
        },
      ]
    `)

  // Should keep underscores in the CSS variable itself, but remove underscores
  // in fallback values
  expect(run('bg-(--a_b,c_d_var(--e_f,g_h))/(--i_j,k_l_var(--m_n,o_p))', { utilities }))
    .toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": {
          "kind": "arbitrary",
          "value": "var(--i_j,k l var(--m_n,o p))",
        },
        "raw": "bg-(--a_b,c_d_var(--e_f,g_h))/(--i_j,k_l_var(--m_n,o_p))",
        "root": "bg",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "var(--a_b,c d var(--e_f,g h))",
        },
        "variants": [],
      },
    ]
  `)
})

it('should not parse an invalid arbitrary shorthand modifier', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  // Completely empty
  expect(run('bg-red-500/()', { utilities })).toMatchInlineSnapshot(`[]`)

  // Invalid due to leading spaces
  expect(run('bg-red-500/(_--)', { utilities })).toMatchInlineSnapshot(`[]`)
  expect(run('bg-red-500/(_--x)', { utilities })).toMatchInlineSnapshot(`[]`)

  // Invalid due to leading spaces
  expect(run('bg-red-500/(_--)', { utilities })).toMatchInlineSnapshot(`[]`)
  expect(run('bg-red-500/(_--x)', { utilities })).toMatchInlineSnapshot(`[]`)

  // Invalid due to top-level `;` or `}` characters
  expect(run('bg-red-500/(--x;--y)', { utilities })).toMatchInlineSnapshot(`[]`)
  expect(run('bg-red-500/(--x:{foo:bar})', { utilities })).toMatchInlineSnapshot(`[]`)

  // Valid, but ensuring that we didn't make an off-by-one error
  expect(run('bg-red-500/(--x)', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": {
          "kind": "arbitrary",
          "value": "var(--x)",
        },
        "raw": "bg-red-500/(--x)",
        "root": "bg",
        "value": {
          "fraction": null,
          "kind": "named",
          "value": "red-500",
        },
        "variants": [],
      },
    ]
  `)
})

it('should not parse an invalid arbitrary shorthand value', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  // Completely empty
  expect(run('bg-()', { utilities })).toMatchInlineSnapshot(`[]`)

  // Invalid due to leading spaces
  expect(run('bg-(_--)', { utilities })).toMatchInlineSnapshot(`[]`)
  expect(run('bg-(_--x)', { utilities })).toMatchInlineSnapshot(`[]`)

  // Invalid due to leading spaces
  expect(run('bg-(_--)', { utilities })).toMatchInlineSnapshot(`[]`)
  expect(run('bg-(_--x)', { utilities })).toMatchInlineSnapshot(`[]`)

  // Invalid due to top-level `;` or `}` characters
  expect(run('bg-(--x;--y)', { utilities })).toMatchInlineSnapshot(`[]`)
  expect(run('bg-(--x:{foo:bar})', { utilities })).toMatchInlineSnapshot(`[]`)

  // Valid, but ensuring that we didn't make an off-by-one error
  expect(run('bg-(--x)', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "bg-(--x)",
        "root": "bg",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "var(--x)",
        },
        "variants": [],
      },
    ]
  `)
})

it('should not parse a utility with an implicit invalid variable as the modifier using the shorthand', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-red-500/(value)', { utilities })).toMatchInlineSnapshot(`[]`)
})

it('should parse a utility with an implicit variable as the modifier that is important', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-red-500/[var(--value)]!', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": true,
        "kind": "functional",
        "modifier": {
          "kind": "arbitrary",
          "value": "var(--value)",
        },
        "raw": "bg-red-500/[var(--value)]!",
        "root": "bg",
        "value": {
          "fraction": null,
          "kind": "named",
          "value": "red-500",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with an explicit variable as the modifier', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-red-500/[var(--value)]', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": {
          "kind": "arbitrary",
          "value": "var(--value)",
        },
        "raw": "bg-red-500/[var(--value)]",
        "root": "bg",
        "value": {
          "fraction": null,
          "kind": "named",
          "value": "red-500",
        },
        "variants": [],
      },
    ]
  `)
})

it('should parse a utility with an explicit variable as the modifier that is important', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-red-500/[var(--value)]!', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": true,
        "kind": "functional",
        "modifier": {
          "kind": "arbitrary",
          "value": "var(--value)",
        },
        "raw": "bg-red-500/[var(--value)]!",
        "root": "bg",
        "value": {
          "fraction": null,
          "kind": "named",
          "value": "red-500",
        },
        "variants": [],
      },
    ]
  `)
})

it('should not parse a partial variant', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.static('open', () => {})
  variants.functional('data', () => {})

  expect(run('open-:flex', { utilities, variants })).toMatchInlineSnapshot(`[]`)
  expect(run('data-:flex', { utilities, variants })).toMatchInlineSnapshot(`[]`)
})

it('should parse a static variant starting with @', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.static('@lg', () => {})

  expect(run('@lg:flex', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "@lg:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "static",
            "root": "@lg",
          },
        ],
      },
    ]
  `)
})

it('should parse a functional variant with a modifier', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.functional('foo', () => {})

  expect(run('foo-bar/50:flex', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "foo-bar/50:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "functional",
            "modifier": {
              "kind": "named",
              "value": "50",
            },
            "root": "foo",
            "value": {
              "kind": "named",
              "value": "bar",
            },
          },
        ],
      },
    ]
  `)
})

it('should not parse variants with multiple modifiers', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.static('hover', () => {})
  variants.compound('group', Compounds.StyleRules, () => {})

  expect(run('group-hover/foo:flex', { utilities, variants })).toHaveLength(1)
  expect(run('group-hover/foo/:flex', { utilities, variants })).toEqual([])
  expect(run('group-hover/foo//bar:flex', { utilities, variants })).toEqual([])
})

it('should parse a functional variant starting with @', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.functional('@', () => {})

  expect(run('@lg:flex', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "@lg:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "functional",
            "modifier": null,
            "root": "@",
            "value": {
              "kind": "named",
              "value": "lg",
            },
          },
        ],
      },
    ]
  `)
})

it('should parse a functional variant starting with @ that has a hyphen', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.functional('@', () => {})

  expect(run('@foo-bar:flex', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "@foo-bar:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "functional",
            "modifier": null,
            "root": "@",
            "value": {
              "kind": "named",
              "value": "foo-bar",
            },
          },
        ],
      },
    ]
  `)
})

it('should parse a functional variant starting with @ and a modifier', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.functional('@', () => {})

  expect(run('@lg/name:flex', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "@lg/name:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "functional",
            "modifier": {
              "kind": "named",
              "value": "name",
            },
            "root": "@",
            "value": {
              "kind": "named",
              "value": "lg",
            },
          },
        ],
      },
    ]
  `)
})

it('should replace `_` with ` `', () => {
  let utilities = new Utilities()
  utilities.functional('content', () => [])

  expect(run('content-["hello_world"]', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "content-["hello_world"]",
        "root": "content",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": ""hello world"",
        },
        "variants": [],
      },
    ]
  `)
})

it('should not replace `\\_` with ` ` (when it is escaped)', () => {
  let utilities = new Utilities()
  utilities.functional('content', () => [])

  expect(run('content-["hello\\_world"]', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "content-["hello\\_world"]",
        "root": "content",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": ""hello_world"",
        },
        "variants": [],
      },
    ]
  `)
})

it('should not replace `_` inside of `url()`', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-[no-repeat_url(https://example.com/some_page)]', { utilities }))
    .toMatchInlineSnapshot(`
      [
        {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "raw": "bg-[no-repeat_url(https://example.com/some_page)]",
          "root": "bg",
          "value": {
            "dataType": null,
            "kind": "arbitrary",
            "value": "no-repeat url(https://example.com/some_page)",
          },
          "variants": [],
        },
      ]
    `)
})

it('should not replace `_` in the first argument to `var()`', () => {
  let utilities = new Utilities()
  utilities.functional('ml', () => [])

  expect(run('ml-[var(--spacing-1_5,_var(--spacing-2_5,_1rem))]', { utilities }))
    .toMatchInlineSnapshot(`
      [
        {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "raw": "ml-[var(--spacing-1_5,_var(--spacing-2_5,_1rem))]",
          "root": "ml",
          "value": {
            "dataType": null,
            "kind": "arbitrary",
            "value": "var(--spacing-1_5, var(--spacing-2_5, 1rem))",
          },
          "variants": [],
        },
      ]
    `)
})

it('should not replace `_` in the first argument to `theme()`', () => {
  let utilities = new Utilities()
  utilities.functional('ml', () => [])

  expect(run('ml-[theme(--spacing-1_5,_theme(--spacing-2_5,_1rem))]', { utilities }))
    .toMatchInlineSnapshot(`
      [
        {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "raw": "ml-[theme(--spacing-1_5,_theme(--spacing-2_5,_1rem))]",
          "root": "ml",
          "value": {
            "dataType": null,
            "kind": "arbitrary",
            "value": "theme(--spacing-1_5, theme(--spacing-2_5, 1rem))",
          },
          "variants": [],
        },
      ]
    `)
})

it('should parse arbitrary properties', () => {
  expect(run('[color:red]')).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "arbitrary",
        "modifier": null,
        "property": "color",
        "raw": "[color:red]",
        "value": "red",
        "variants": [],
      },
    ]
  `)
})

it('should parse arbitrary properties with a modifier', () => {
  expect(run('[color:red]/50')).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "arbitrary",
        "modifier": {
          "kind": "named",
          "value": "50",
        },
        "property": "color",
        "raw": "[color:red]/50",
        "value": "red",
        "variants": [],
      },
    ]
  `)
})

it('should skip arbitrary properties that start with an uppercase letter', () => {
  expect(run('[Color:red]')).toMatchInlineSnapshot(`[]`)
})

it('should skip arbitrary properties that do not have a property and value', () => {
  expect(run('[color]')).toMatchInlineSnapshot(`[]`)
})

it('should parse arbitrary properties that are important', () => {
  expect(run('[color:red]!')).toMatchInlineSnapshot(`
    [
      {
        "important": true,
        "kind": "arbitrary",
        "modifier": null,
        "property": "color",
        "raw": "[color:red]!",
        "value": "red",
        "variants": [],
      },
    ]
  `)
})

it('should parse arbitrary properties with a variant', () => {
  let variants = new Variants()
  variants.static('hover', () => {})

  expect(run('hover:[color:red]', { variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "arbitrary",
        "modifier": null,
        "property": "color",
        "raw": "hover:[color:red]",
        "value": "red",
        "variants": [
          {
            "kind": "static",
            "root": "hover",
          },
        ],
      },
    ]
  `)
})

it('should parse arbitrary properties with stacked variants', () => {
  let variants = new Variants()
  variants.static('hover', () => {})
  variants.static('focus', () => {})

  expect(run('focus:hover:[color:red]', { variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "arbitrary",
        "modifier": null,
        "property": "color",
        "raw": "focus:hover:[color:red]",
        "value": "red",
        "variants": [
          {
            "kind": "static",
            "root": "hover",
          },
          {
            "kind": "static",
            "root": "focus",
          },
        ],
      },
    ]
  `)
})

it('should parse arbitrary properties that are important and using stacked arbitrary variants', () => {
  expect(run('[@media(width>=123px)]:[&_p]:[color:red]!')).toMatchInlineSnapshot(`
    [
      {
        "important": true,
        "kind": "arbitrary",
        "modifier": null,
        "property": "color",
        "raw": "[@media(width>=123px)]:[&_p]:[color:red]!",
        "value": "red",
        "variants": [
          {
            "kind": "arbitrary",
            "relative": false,
            "selector": "& p",
          },
          {
            "kind": "arbitrary",
            "relative": false,
            "selector": "@media(width>=123px)",
          },
        ],
      },
    ]
  `)
})

it('should not parse compound group with a non-compoundable variant', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.compound('group', Compounds.StyleRules, () => {})

  expect(run('group-*:flex', { utilities, variants })).toMatchInlineSnapshot(`[]`)
})

it('empty data types are invalid', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])
  let variants = new Variants()

  expect(run('bg-[:foo]', { utilities, variants })).toMatchInlineSnapshot(`[]`)
})

it('should parse a variant containing an arbitrary string with unbalanced parens, brackets, curlies and other quotes', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.functional('string', () => {})

  expect(run(`string-['}[("\\'']:flex`, { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "string-['}[("\\'']:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "functional",
            "modifier": null,
            "root": "string",
            "value": {
              "kind": "arbitrary",
              "value": "'}[("\\''",
            },
          },
        ],
      },
    ]
  `)
})

it('should parse candidates with a prefix', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.static('hover', () => {})

  // A prefix is required
  expect(run(`flex`, { utilities, variants, prefix: 'tw' })).toEqual([])

  // The prefix always comes first — even before variants
  expect(run(`tw:flex`, { utilities, variants, prefix: 'tw' })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "tw:flex",
        "root": "flex",
        "variants": [],
      },
    ]
  `)
  expect(run(`tw:hover:flex`, { utilities, variants, prefix: 'tw' })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "raw": "tw:hover:flex",
        "root": "flex",
        "variants": [
          {
            "kind": "static",
            "root": "hover",
          },
        ],
      },
    ]
  `)
})

it('should not parse candidates with more than 64 stacked variants', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  let variants = new Variants()
  variants.static('hover', () => {})

  expect(run(`${'hover:'.repeat(64)}flex`, { utilities, variants })[0].variants).toHaveLength(64)
  expect(run(`${'hover:'.repeat(65)}flex`, { utilities, variants })).toEqual([])

  // The prefix is not a variant
  expect(
    run(`tw:${'hover:'.repeat(64)}flex`, { utilities, variants, prefix: 'tw' })[0].variants,
  ).toHaveLength(64)
})

it('should parse variants and utilities with many dashes in linear time', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])
  utilities.functional('bg', () => [])

  let variants = new Variants()
  variants.functional('data', () => {})

  // E.g.: `a-a-a-…-a`
  let value = 'a-'.repeat(8_000) + 'a'

  expect(run(`data-${value}:flex`, { utilities, variants })[0].variants).toEqual([
    { kind: 'functional', root: 'data', modifier: null, value: { kind: 'named', value } },
  ])
  expect(run(`bg-${value}`, { utilities, variants })).toMatchObject([
    { kind: 'functional', root: 'bg', value: { kind: 'named', value } },
  ])
  expect(run(`${value}-flex`, { utilities, variants })).toEqual([])

  let start = performance.now()
  for (let i = 0; i < 10; i++) {
    run(`data-${value}:flex`, { utilities, variants })
    run(`bg-${value}`, { utilities, variants })
    run(`${value}-flex`, { utilities, variants })
  }
  let duration = performance.now() - start

  // Looking up the part before each dash as a root takes seconds
  expect(duration).toBeLessThan(1_000)
})

it.each([
  // Empty arbitrary value
  'bg-[]',
  'bg-()',
  // — Tricking the parser with a space is not allowed
  'bg-[_]',
  'bg-(_)',

  // Empty arbitrary value, with typehint
  'bg-[color:]',
  'bg-(color:)',
  // — Tricking the parser with a space is not allowed
  'bg-[color:_]',
  'bg-(color:_)',

  // Empty arbitrary modifier
  'bg-red-500/[]',
  'bg-red-500/()',
  // — Tricking the parser with a space is not allowed
  'bg-red-500/[_]',
  'bg-red-500/(_)',

  // Empty arbitrary modifier for arbitrary properties
  '[color:red]/[]',
  '[color:red]/()',
  // — Tricking the parser with a space is not allowed
  '[color:red]/[_]',
  '[color:red]/(_)',

  // Empty arbitrary value and modifier
  'bg-[]/[]',
  'bg-()/[]',
  'bg-[]/()',
  'bg-()/()',
  // — Tricking the parser with a space is not allowed
  'bg-[_]/[]',
  'bg-(_)/[]',
  'bg-[_]/()',
  'bg-(_)/()',
  'bg-[]/[_]',
  'bg-()/[_]',
  'bg-[]/(_)',
  'bg-()/(_)',
  'bg-[_]/[_]',
  'bg-(_)/[_]',
  'bg-[_]/(_)',
  'bg-(_)/(_)',

  // Functional variants
  // Empty arbitrary value in variant
  'data-[]:flex',
  'data-():flex',
  // — Tricking the parser with a space is not allowed
  'data-[_]:flex',
  'data-(_):flex',

  // Empty arbitrary modifier in variant
  'data-foo/[]:flex',
  'data-foo/():flex',
  // — Tricking the parser with a space is not allowed
  'data-foo/[_]:flex',
  'data-foo/(_):flex',

  // Empty arbitrary value and modifier in variant
  'data-[]/[]:flex',
  'data-()/[]:flex',
  'data-[]/():flex',
  'data-()/():flex',
  // — Tricking the parser with a space is not allowed
  'data-[_]/[]:flex',
  'data-(_)/[]:flex',
  'data-[_]/():flex',
  'data-(_)/():flex',
  'data-[]/[_]:flex',
  'data-()/[_]:flex',
  'data-[]/(_):flex',
  'data-()/(_):flex',
  'data-[_]/[_]:flex',
  'data-(_)/[_]:flex',
  'data-[_]/(_):flex',
  'data-(_)/(_):flex',

  // Compound variants
  // Empty arbitrary value in variant
  'group-data-[]:flex',
  'group-data-():flex',
  // — Tricking the parser with a space is not allowed
  'group-data-[_]:flex',
  'group-data-(_):flex',

  // Empty arbitrary modifier in variant
  'group-data-foo/[]:flex',
  'group-data-foo/():flex',
  // — Tricking the parser with a space is not allowed
  'group-data-foo/[_]:flex',
  'group-data-foo/(_):flex',

  // Empty arbitrary value and modifier in variant
  'group-data-[]/[]:flex',
  'group-data-()/[]:flex',
  'group-data-[]/():flex',
  'group-data-()/():flex',
  // — Tricking the parser with a space is not allowed
  'group-data-[_]/[]:flex',
  'group-data-(_)/[]:flex',
  'group-data-[_]/():flex',
  'group-data-(_)/():flex',
  'group-data-[]/[_]:flex',
  'group-data-()/[_]:flex',
  'group-data-[]/(_):flex',
  'group-data-()/(_):flex',
  'group-data-[_]/[_]:flex',
  'group-data-(_)/[_]:flex',
  'group-data-[_]/(_):flex',
  'group-data-(_)/(_):flex',
])('should not parse invalid empty arbitrary values: %s', (rawCandidate) => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])
  utilities.functional('bg', () => [])

  let variants = new Variants()
  variants.functional('data', () => {})
  variants.compound('group', Compounds.StyleRules, () => {})

  expect(run(rawCandidate, { utilities, variants })).toEqual([])
})

it.each([
  // Arbitrary properties with `;` or `}`
  '[color:red;color:blue]',
  '[color:red}html{color:blue]',

  // Arbitrary values that end the declaration
  'bg-[red;color:blue]',

  // Arbitrary values that end the block
  'bg-[red}html{color:blue]',

  // Arbitrary variants that end the block
  '[&{color:red}]:flex',

  // Arbitrary variant values that end the block
  'data-[a]{color:red}foo[a]:flex',

  // Named values contain invalid characters
  'data-foo=bar:flex',
  'bg-foo=bar',
  'bg-red-500/foo=bar',

  // Arbitrary values, properties, modifiers and variants that start a comment
  'bg-[red/*]',
  'bg-[red/*comment*/]',
  '[color:red/*]',
  'bg-red-500/[50%/*]',
  '[&/*]:flex',
  'data-[a/*]:flex',
  '[a/*b:red]',
  "bg-['a\n/*']",
  "[a':'/*']",
  "bg-['/*]",
  "bg-[url(foo'bar)/*')]",
  '[x:url(foo"bar)/*")]',
  'bg-[URL(a(b)/*)]',
  "bg-[url('a',URL(_'b)/*'))]",
  "bg-[u\\72l(foo'bar)/*')]",
  "bg-[u\\72_l(foo'bar)/*')]",
  // `\\` is an escaped `\`, so the `_` before the `url(…)` is not escaped.
  "bg-[a\\\\_url(foo'bar)/*')]",
  // `--my\_url(…)` is not a `url(…)`, but it keeps the `_`, so the inner
  // `URL(…)` has no quoted string.
  "[x:--my\\_url(URL(_'a)/*'))]",
  '[--x:a()<//*)*/]',

  // A `/*` inside of an unquoted `url(…)` that PostCSS does not read as a
  // `url(…)`, or that CSS does not read as a `url(…)` at all
  'bg-[URL(/a/*.png)]',
  'bg-[Url(/a/*.png)]',
  'bg-[url(a.png),url(/b/*.png)]',
  'bg-[#url(/a/*.png)]',
  'bg-[@url(/a/*.png)]',
  'bg-[1url(/a/*.png)]',
  // PostCSS reads `@image:url` as one at-word
  'bg-[@image:url(/a/*.png)]',
  'bg-[a@b:url(/a/*.png)]',
  // `decodeArbitraryValue` turns this into `a\_url(…)`
  'bg-[a\\\\_url(/a/*.png)]',
  // The outer `url(…)` keeps the `_`, so this calls the `b_url` function
  "bg-[url('a',b_url(/c/*.png))]",
  // Only a value of a declaration can have one, e.g. not `[data-url(…)]`
  'data-[url(/a/*.png)]:flex',
  'bg-red-500/[url(/a/*.png)]',
  '[&_url(/a/*.png)]:flex',

  // PostCSS reads `\/*` as a `\` and the start of a comment
  'bg-[\\/*]',
  'bg-[URL(a\\/*b)]',
])('should not parse invalid values: %s', (rawCandidate) => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])
  utilities.functional('bg', () => [])

  let variants = new Variants()
  variants.functional('data', () => {})
  variants.compound('group', Compounds.StyleRules, () => {})

  expect(run(rawCandidate, { utilities, variants })).toEqual([])
})

it('should not let a random arbitrary value comment out the CSS after it', async () => {
  let designSystem = await __unstable__loadDesignSystem('@tailwind utilities', { base: __dirname })

  // A seeded random number generator (mulberry32), so a failure can be reproduced.
  let seed = 20690
  function random() {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  let parts = ['url(', 'URL(', 'a(', '(', ')', "'", '"', '/*', '*/', '/', '*', '_', '\\']
  parts.push('\\_', '\\72', '#', '@', ',', ':', 'a', '1', '-', ' ')

  for (let i = 0; i < 5000; i++) {
    let value = ''
    let count = 1 + Math.floor(random() * 10)
    for (let j = 0; j < count; j++) value += parts[Math.floor(random() * parts.length)]

    for (let candidate of [`[--x:${value}]`, `bg-[${value}]`]) {
      let [css] = designSystem.candidatesToCss([candidate])
      if (!css) continue

      let { code } = transform({
        filename: 'input.css',
        code: Buffer.from(`${css}.b{color:red}`),
        minify: true,
        errorRecovery: true,
      })

      expect(code.toString(), candidate).toContain('.b{color:red}')
    }
  }
})

it('should parse a function name with an escaped `_`', () => {
  let utilities = new Utilities()
  utilities.functional('w', () => [])

  // `\_` is a literal `_`, so this calls the `--my_fn` function.
  expect(run('w-[--my\\_fn(1px)]', { utilities })).toMatchObject([
    { value: { kind: 'arbitrary', value: '--my_fn(1px)' } },
  ])

  // The function is `--my_url`, not a `url(…)`, so its argument can have a `(`.
  expect(run('w-[--my\\_url(var(--size))]', { utilities })).toMatchObject([
    { value: { kind: 'arbitrary', value: '--my_url(var(--size))' } },
  ])
})

it('should parse a quoted string after an `_` in an uppercase `URL(…)`', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  // The `_` becomes a space, so this is a quoted `URL( 'image.png')`.
  expect(run(`bg-[URL(_'image.png')]`, { utilities })).toMatchObject([
    { value: { kind: 'arbitrary', value: "URL( 'image.png')" } },
  ])
})

it('should parse a `/*` inside of a string in an arbitrary value', () => {
  let utilities = new Utilities()
  utilities.functional('content', () => [])

  expect(run(`content-['/*']`, { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "raw": "content-['/*']",
        "root": "content",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "'/*'",
        },
        "variants": [],
      },
    ]
  `)
})

it.each([
  ['bg-[url(/a/*.png)]', 'url(/a/*.png)'],
  ['bg-[url(a.png),_url(/b/*.png)]', 'url(a.png), url(/b/*.png)'],
  ['bg-[image-set(url(/a/*.png)_1x)]', 'image-set(url(/a/*.png) 1x)'],
  ['bg-[no-repeat_url(/a/*.png)]', 'no-repeat url(/a/*.png)'],
  ['bg-[image:url(/a/*.png)]', 'url(/a/*.png)'],
])('should parse a `/*` inside of an unquoted `url(…)`: %s', (rawCandidate, value) => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run(rawCandidate, { utilities })).toMatchObject([{ value: { kind: 'arbitrary', value } }])
})

it('should parse a `/*` inside of an unquoted `url(…)` in an arbitrary property', () => {
  expect(run('[background-image:url(/a/*.png)]')).toMatchObject([
    { kind: 'arbitrary', property: 'background-image', value: 'url(/a/*.png)' },
  ])
})

it.each([
  // Arbitrary values
  "before:content-['</style>']",
  "content-['</STYLE>']",
  'font-[x</style>]',

  // Arbitrary properties
  '[--x:</style>]',

  // Arbitrary variants
  '[&[data-x="</style>"]]:flex',

  // Modifiers
  'bg-red-500/[</style>]',

  // CSS escapes
  "content-['\\3c /style>']",
  "content-['\\3c_/style>']",
  "content-['\\3c\t/style>']",
  "content-['\\3c\n/style>']",
  "content-['\\3c\r/style>']",
  "content-['\\3c\f/style>']",
  "content-['\\3c\r\n/style>']",
  "content-['\\3C/STYLE>']",
  "content-['\\00003c/style>']",
  "content-['<\\/style>']",
  "content-['\\</\\s\\74 yle>']",
])('should not parse candidates that contain `</style`: %s', (rawCandidate) => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])
  utilities.functional('bg', () => [])
  utilities.functional('content', () => [])
  utilities.functional('font', () => [])

  let variants = new Variants()
  variants.static('before', () => {})

  expect(run(rawCandidate, { utilities, variants })).toEqual([])
})

it.each([
  "content-['</>']",
  "content-['</styl']",
  "content-['<_/style>']",
  "content-['\\3c\\_/style>']",
  '[--x:a<b]',
])('should parse candidates that contain `<` but not `</style`: %s', (rawCandidate) => {
  let utilities = new Utilities()
  utilities.functional('content', () => [])

  expect(run(rawCandidate, { utilities })).not.toEqual([])
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
  ['bg-[var(--spacing)-1px]', 'bg-[var(--spacing)-1px]'],
  ['bg-[var(--spacing)_-_1px]', 'bg-[var(--spacing)-1px]'],
  ['bg-[var(--_spacing)]', 'bg-(--_spacing)'],
  ['bg-(--_spacing)', 'bg-(--_spacing)'],
  ['bg-[-1px_-1px]', 'bg-[-1px_-1px]'],
  ['p-[round(to-zero,1px)]', 'p-[round(to-zero,1px)]'],
  ['w-1/2', 'w-1/2'],
  ['p-[calc((100vw-theme(maxWidth.2xl))_/_2)]', 'p-[calc((100vw-theme(maxWidth.2xl))/2)]'],

  // Keep spaces in strings
  ['content-["hello_world"]', 'content-["hello_world"]'],
  ['content-[____"hello_world"___]', 'content-["hello_world"]'],

  // Do not escape underscores for url() and CSS variable in var()
  ['bg-[no-repeat_url(/image_13.png)]', 'bg-[no-repeat_url(/image_13.png)]'],
  [
    'bg-[var(--spacing-0_5,_var(--spacing-1_5,_3rem))]',
    'bg-(--spacing-0_5,var(--spacing-1_5,3rem))',
  ],

  // Normalize whitespace in arbitrary properties
  ['[display:flex]', '[display:flex]'],
  ['[display:_flex]', '[display:flex]'],
  ['[display:flex_]', '[display:flex]'],
  ['[display:_flex_]', '[display:flex]'],

  // Normalize whitespace in `calc` expressions
  ['w-[calc(100%-2rem)]', 'w-[calc(100%-2rem)]'],
  ['w-[calc(100%_-_2rem)]', 'w-[calc(100%-2rem)]'],

  // Normalize the important modifier
  ['!flex', 'flex!'],
  ['flex!', 'flex!'],
]

const variants = [
  ['', ''], // no variant
  ['*:', '*:'],
  ['focus:', 'focus:'],
  ['group-focus:', 'group-focus:'],

  ['hover:focus:', 'hover:focus:'],
  ['hover:group-focus:', 'hover:group-focus:'],
  ['group-hover:focus:', 'group-hover:focus:'],
  ['group-hover:group-focus:', 'group-hover:group-focus:'],

  ['min-[10px]:', 'min-[10px]:'],

  // Normalize spaces
  ['min-[calc(1000px_+_12em)]:', 'min-[calc(1000px+12em)]:'],
  ['min-[calc(1000px_+12em)]:', 'min-[calc(1000px+12em)]:'],
  ['min-[calc(1000px+_12em)]:', 'min-[calc(1000px+12em)]:'],
  ['min-[calc(1000px___+___12em)]:', 'min-[calc(1000px+12em)]:'],

  ['peer-[&_p]:', 'peer-[&_p]:'],
  ['peer-[&_p]:hover:', 'peer-[&_p]:hover:'],
  ['hover:peer-[&_p]:', 'hover:peer-[&_p]:'],
  ['hover:peer-[&_p]:focus:', 'hover:peer-[&_p]:focus:'],
  ['peer-[&:hover]:peer-[&_p]:', 'peer-[&:hover]:peer-[&_p]:'],

  ['[p]:', '[p]:'],
  ['[_p_]:', '[p]:'],
  ['has-[p]:', 'has-[p]:'],
  ['has-[_p_]:', 'has-[p]:'],

  // Simplify `&:is(p)` to `p`
  ['[&:is(p)]:', '[p]:'],
  ['[&:is(_p_)]:', '[p]:'],
  ['has-[&:is(p)]:', 'has-[p]:'],
  ['has-[&:is(_p_)]:', 'has-[p]:'],

  // Handle special `@` variants. These shouldn't be printed as `@-`
  ['@xl:', '@xl:'],
  ['@[123px]:', '@[123px]:'],

  // Compound variants that forward modifiers
  ['not-group-hover/name:', 'not-group-hover/name:'],
  ['has-group-peer-hover/name:', 'has-group-peer-hover/name:'],
  ['in-group-peer-hover/name:', 'in-group-peer-hover/name:'],
]

let combinations: [string, string][] = []

for (let [inputVariant, outputVariant] of variants) {
  for (let [inputCandidate, outputCandidate] of candidates) {
    combinations.push([`${inputVariant}${inputCandidate}`, `${outputVariant}${outputCandidate}`])
  }
}

describe('normalize candidates', () => {
  test.each(combinations)('`%s` -> `%s`', async (candidate: string, result: string) => {
    let designSystem = await __unstable__loadDesignSystem('@tailwind utilities', {
      base: __dirname,
    })

    let [parsed] = designSystem.parseCandidate(candidate)

    expect(designSystem.printCandidate(parsed)).toEqual(result)
  })
})
