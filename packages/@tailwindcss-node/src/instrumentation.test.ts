import { stripVTControlCharacters } from 'util'
import { expect, it } from 'vitest'
import { Instrumentation } from './instrumentation'

it('should add instrumentation', () => {
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
