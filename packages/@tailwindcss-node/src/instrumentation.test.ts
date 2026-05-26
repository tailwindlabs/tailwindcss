import { stripVTControlCharacters } from 'util'
import { expect, it } from 'vitest'
import { Instrumentation } from './instrumentation'

it('should add instrumentation using start/end markers', () => {
  let I = new Instrumentation()

  I.start('Foo')
  let x = 1
  for (let i = 0; i < 100; i++) {
    I.start('Bar')
    x **= 2
    I.end('Bar')
  }
  I.end('Foo')

  I.hit('Potato')
  I.hit('Potato')
  I.hit('Potato')
  I.hit('Potato')

  expect.assertions(1)

  I.report((output) => {
    expect(stripVTControlCharacters(output).replace(/\[.*\]/g, '[0.xxms]')).toMatchInlineSnapshot(`
      "
      Hits:
        Potato × 4

      Timers:
      [0.xxms] Foo
      [0.xxms]   ↳ Bar × 100
      "
    `)
  })
})

it('should measure callbacks via the `span` api', () => {
  let I = new Instrumentation()

  I.span('Foo', () => {
    let x = 1
    for (let i = 0; i < 100; i++) {
      I.span('Bar', () => {
        x **= 2
      })
    }
  })

  expect.assertions(1)

  I.report((output) => {
    expect(stripVTControlCharacters(output).replace(/\[.*\]/g, '[0.xxms]')).toMatchInlineSnapshot(`
      "
      [0.xxms] Foo
      [0.xxms]   ↳ Bar × 100
      "
    `)
  })
})

it('should measure async callbacks via the `span` api', async () => {
  let I = new Instrumentation()

  await I.span('Foo', async () => {
    let x = 1
    for (let i = 0; i < 100; i++) {
      I.span('Bar', () => {
        x **= 2
      })
    }
    await new Promise((r) => setTimeout(r, 500))
  })

  expect.assertions(2)

  I.report((output) => {
    expect(stripVTControlCharacters(output).replace(/\[.*\]/g, '[0.xxms]')).toMatchInlineSnapshot(`
      "
      [0.xxms] Foo
      [0.xxms]   ↳ Bar × 100
      "
    `)

    let [, duration] = stripVTControlCharacters(output).match(/\[(.*)\]/)!
    expect(parseFloat(duration)).toBeGreaterThanOrEqual(500)
  })
})

it('should measure blocks until they go out of scope via `using`', () => {
  let I = new Instrumentation()

  {
    using _ = I.track('Foo')

    let x = 1
    for (let i = 0; i < 100; i++) {
      using _ = I.track('Bar')
      x **= 2
    }
  }

  expect.assertions(1)

  I.report((output) => {
    expect(stripVTControlCharacters(output).replace(/\[.*\]/g, '[0.xxms]')).toMatchInlineSnapshot(`
      "
      [0.xxms] Foo
      [0.xxms]   ↳ Bar × 100
      "
    `)
  })
})

it('should auto end pending timers when reporting', () => {
  let I = new Instrumentation()

  I.start('Foo')
  let x = 1
  for (let i = 0; i < 100; i++) {
    I.start('Bar')
    x **= 2
    I.end('Bar')
  }
  I.start('Baz')

  expect.assertions(1)

  I.report((output) => {
    expect(stripVTControlCharacters(output).replace(/\[.*\]/g, '[0.xxms]')).toMatchInlineSnapshot(`
      "
      [0.xxms] Foo
      [0.xxms]   ↳ Bar × 100
      [0.xxms]   ↳ Baz
      "
    `)
  })
})
