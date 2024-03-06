import { expect, it } from 'vitest'
import { args, type Arg } from './args'

it('should be possible to parse a single argument', () => {
  expect(
    args(
      {
        '--input': { type: 'string', description: 'Input file' },
      },
      ['--input', 'input.css'],
    ),
  ).toMatchInlineSnapshot(`
    {
      "--input": "input.css",
      "_": [],
    }
  `)
})

it('should fallback to the default value if no flag is passed', () => {
  expect(
    args(
      {
        '--input': { type: 'string', description: 'Input file', default: 'input.css' },
      },
      ['--other'],
    ),
  ).toMatchInlineSnapshot(`
    {
      "--input": "input.css",
      "_": [],
    }
  `)
})

it('should fallback to null if no flag is passed and no default value is provided', () => {
  expect(
    args(
      {
        '--input': { type: 'string', description: 'Input file' },
      },
      ['--other'],
    ),
  ).toMatchInlineSnapshot(`
    {
      "--input": null,
      "_": [],
    }
  `)
})

it('should be possible to parse a single argument using the shorthand alias', () => {
  expect(
    args(
      {
        '--input': { type: 'string', description: 'Input file', alias: '-i' },
      },
      ['-i', 'input.css'],
    ),
  ).toMatchInlineSnapshot(`
    {
      "--input": "input.css",
      "_": [],
    }
  `)
})

it('should convert the incoming value to the correct type', () => {
  expect(
    args(
      {
        '--input': { type: 'string', description: 'Input file' },
        '--watch': { type: 'boolean', description: 'Watch mode' },
        '--retries': { type: 'number', description: 'Amount of retries' },
      },
      ['--input', 'input.css', '--watch', '--retries', '3'],
    ),
  ).toMatchInlineSnapshot(`
    {
      "--input": "input.css",
      "--retries": 3,
      "--watch": true,
      "_": [],
    }
  `)
})

it('should be possible to provide multiple types, and convert the value to that type', () => {
  let options = {
    '--retries': { type: 'boolean | number | string', description: 'Retries' },
  } satisfies Arg

  expect(args(options, ['--retries'])).toMatchInlineSnapshot(`
    {
      "--retries": true,
      "_": [],
    }
  `)
  expect(args(options, ['--retries', 'true'])).toMatchInlineSnapshot(`
    {
      "--retries": true,
      "_": [],
    }
  `)
  expect(args(options, ['--retries', 'false'])).toMatchInlineSnapshot(`
    {
      "--retries": false,
      "_": [],
    }
  `)
  expect(args(options, ['--retries', '5'])).toMatchInlineSnapshot(`
    {
      "--retries": 5,
      "_": [],
    }
  `)
  expect(args(options, ['--retries', 'indefinitely'])).toMatchInlineSnapshot(`
    {
      "--retries": "indefinitely",
      "_": [],
    }
  `)
})
