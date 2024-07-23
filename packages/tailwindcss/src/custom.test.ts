import { test } from 'vitest'
import { findValueFns } from './custom'

test('returns empty when none are found', ({ expect }) => {
  let fns = findValueFns('bar')
  expect(fns).toEqual([])
})

test('empty value functions are interpreted as any arbitrary value', ({ expect }) => {
  let fns = findValueFns('value()')
  expect(fns).toEqual([
    {
      start: expect.any(Number),
      end: expect.any(Number),

      kind: 'value',
      values: [
        {
          kind: 'arbitrary',
          dataType: '*',
        },
      ],
    },
  ])
})

test('matches arbitrary values with data types', ({ expect }) => {
  let fns = findValueFns('value(length-percentage)')
  expect(fns).toEqual([
    {
      start: expect.any(Number),
      end: expect.any(Number),

      kind: 'value',
      values: [
        {
          kind: 'arbitrary',
          dataType: 'length-percentage',
        },
      ],
    },
  ])
})

test('matches bare values with data types', ({ expect }) => {
  let fns = findValueFns('value(named: length-percentage)')

  expect(fns).toEqual([
    {
      start: expect.any(Number),
      end: expect.any(Number),

      kind: 'value',
      values: [
        {
          kind: 'bare',
          dataType: 'length-percentage',
        },
      ],
    },
  ])
})

test('matches theme namespaces', ({ expect }) => {
  let fns = findValueFns('value(--color)')

  expect(fns).toEqual([
    {
      start: expect.any(Number),
      end: expect.any(Number),

      kind: 'value',
      values: [
        {
          kind: 'theme',
          themeKey: '--color',
        },
      ],
    },
  ])
})

test('matches theme namespaces with wildcard', ({ expect }) => {
  let fns = findValueFns('value(--color-*)')

  expect(fns).toEqual([
    {
      start: expect.any(Number),
      end: expect.any(Number),

      kind: 'value',
      values: [
        {
          kind: 'theme',
          themeKey: '--color',
        },
      ],
    },
  ])
})

test('matches theme namespaces with optional quotes', ({ expect }) => {
  let fns1 = findValueFns(`value("--color-*")`)

  expect(fns1).toEqual([
    {
      start: expect.any(Number),
      end: expect.any(Number),

      kind: 'value',
      values: [
        {
          kind: 'theme',
          themeKey: '--color',
        },
      ],
    },
  ])

  let fns2 = findValueFns(`value('--color-*')`)

  expect(fns2).toEqual([
    {
      start: expect.any(Number),
      end: expect.any(Number),

      kind: 'value',
      values: [
        {
          kind: 'theme',
          themeKey: '--color',
        },
      ],
    },
  ])
})

test('Multiple args are turned into different value types', ({ expect }) => {
  let fns1 = findValueFns(`value(*, number, --color, named: length-percentage)`)

  expect(fns1).toMatchInlineSnapshot(`
    [
      {
        "end": 50,
        "kind": "value",
        "start": 0,
        "values": [
          {
            "dataType": "*",
            "kind": "arbitrary",
          },
          {
            "dataType": " number",
            "kind": "arbitrary",
          },
          {
            "dataType": " --color",
            "kind": "arbitrary",
          },
          {
            "dataType": " named: length-percentage",
            "kind": "arbitrary",
          },
        ],
      },
    ]
  `)

  let fns2 = findValueFns(`value('--color-*')`)

  expect(fns2).toEqual()
})
