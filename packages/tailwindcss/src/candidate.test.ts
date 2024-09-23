import { expect, it } from 'vitest'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'
import { Utilities } from './utilities'
import { Variants } from './variants'

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
        "negative": false,
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
        "negative": false,
        "raw": "flex!",
        "root": "flex",
        "variants": [],
      },
    ]
  `)
})

it('should parse a simple utility that can be negative', () => {
  let utilities = new Utilities()
  utilities.functional('translate-x', () => [])

  expect(run('-translate-x-4', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "negative": true,
        "raw": "-translate-x-4",
        "root": "translate-x",
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
        "negative": false,
        "raw": "hover:flex",
        "root": "flex",
        "variants": [
          {
            "compounds": true,
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
        "negative": false,
        "raw": "focus:hover:flex",
        "root": "flex",
        "variants": [
          {
            "compounds": true,
            "kind": "static",
            "root": "hover",
          },
          {
            "compounds": true,
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
        "negative": false,
        "raw": "[&_p]:flex",
        "root": "flex",
        "variants": [
          {
            "compounds": true,
            "kind": "arbitrary",
            "relative": false,
            "selector": "& p",
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
        "negative": false,
        "raw": "data-[disabled]:flex",
        "root": "flex",
        "variants": [
          {
            "compounds": true,
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
  variants.compound('group', () => {})

  expect(run('group-[&_p]/parent-name:flex', { utilities, variants })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "negative": false,
        "raw": "group-[&_p]/parent-name:flex",
        "root": "flex",
        "variants": [
          {
            "compounds": true,
            "kind": "compound",
            "modifier": {
              "kind": "named",
              "value": "parent-name",
            },
            "root": "group",
            "variant": {
              "compounds": true,
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
  variants.compound('group', () => {})
  variants.functional('aria', () => {})

  expect(run('group-aria-[disabled]/parent-name:flex', { utilities, variants }))
    .toMatchInlineSnapshot(`
      [
        {
          "important": false,
          "kind": "static",
          "negative": false,
          "raw": "group-aria-[disabled]/parent-name:flex",
          "root": "flex",
          "variants": [
            {
              "compounds": true,
              "kind": "compound",
              "modifier": {
                "kind": "named",
                "value": "parent-name",
              },
              "root": "group",
              "variant": {
                "compounds": true,
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
  variants.compound('group', () => {})

  expect(run('group-group-group-hover/parent-name:flex', { utilities, variants }))
    .toMatchInlineSnapshot(`
      [
        {
          "important": false,
          "kind": "static",
          "negative": false,
          "raw": "group-group-group-hover/parent-name:flex",
          "root": "flex",
          "variants": [
            {
              "compounds": true,
              "kind": "compound",
              "modifier": {
                "kind": "named",
                "value": "parent-name",
              },
              "root": "group",
              "variant": {
                "compounds": true,
                "kind": "compound",
                "modifier": null,
                "root": "group",
                "variant": {
                  "compounds": true,
                  "kind": "compound",
                  "modifier": null,
                  "root": "group",
                  "variant": {
                    "compounds": true,
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

it('should parse a simple utility with an arbitrary media variant', () => {
  let utilities = new Utilities()
  utilities.static('flex', () => [])

  expect(run('[@media(width>=123px)]:flex', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "static",
        "negative": false,
        "raw": "[@media(width>=123px)]:flex",
        "root": "flex",
        "variants": [
          {
            "compounds": true,
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
        "negative": false,
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
        "negative": false,
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
        "negative": false,
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
        "negative": false,
        "raw": "hover:bg-red-500/50",
        "root": "bg",
        "value": {
          "fraction": "red-500/50",
          "kind": "named",
          "value": "red-500",
        },
        "variants": [
          {
            "compounds": true,
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
        "negative": false,
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

it('should parse a utility with an arbitrary value including a typehint', () => {
  let utilities = new Utilities()
  utilities.functional('bg', () => [])

  expect(run('bg-[color:var(--value)]', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "negative": false,
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
        "negative": false,
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
        "negative": false,
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
        "negative": false,
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
        "negative": false,
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
        "negative": false,
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
        "negative": false,
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
        "negative": false,
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
        "negative": false,
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
        "negative": false,
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
        "negative": false,
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
        "negative": false,
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
        "negative": false,
        "raw": "@lg:flex",
        "root": "flex",
        "variants": [
          {
            "compounds": true,
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
        "negative": false,
        "raw": "foo-bar/50:flex",
        "root": "flex",
        "variants": [
          {
            "compounds": true,
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
        "negative": false,
        "raw": "@lg:flex",
        "root": "flex",
        "variants": [
          {
            "compounds": true,
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
        "negative": false,
        "raw": "@lg/name:flex",
        "root": "flex",
        "variants": [
          {
            "compounds": true,
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
        "negative": false,
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
        "negative": false,
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

  expect(run('bg-[url(https://example.com/some_page)]', { utilities })).toMatchInlineSnapshot(`
    [
      {
        "important": false,
        "kind": "functional",
        "modifier": null,
        "negative": false,
        "raw": "bg-[url(https://example.com/some_page)]",
        "root": "bg",
        "value": {
          "dataType": null,
          "kind": "arbitrary",
          "value": "url(https://example.com/some_page)",
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
            "compounds": true,
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
            "compounds": true,
            "kind": "static",
            "root": "hover",
          },
          {
            "compounds": true,
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
            "compounds": true,
            "kind": "arbitrary",
            "relative": false,
            "selector": "& p",
          },
          {
            "compounds": true,
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
  variants.compound('group', () => {})

  expect(run('group-*:flex', { utilities, variants })).toMatchInlineSnapshot(`[]`)
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
        "negative": false,
        "raw": "string-['}[("\\'']:flex",
        "root": "flex",
        "variants": [
          {
            "compounds": true,
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
        "negative": false,
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
        "negative": false,
        "raw": "tw:hover:flex",
        "root": "flex",
        "variants": [
          {
            "compounds": true,
            "kind": "static",
            "root": "hover",
          },
        ],
      },
    ]
  `)
})
