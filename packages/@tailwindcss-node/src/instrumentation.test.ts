import { stripVTControlCharacters } from 'util'
import { expect, it } from 'vitest'
import { dimensions } from '../../tailwindcss/src/utils/dimensions'
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

  expect.assertions(1)

  I.report((output) => {
    expect(stabilize(output)).toMatchInlineSnapshot(`
      "
      [510.00ms] Foo
      [  0.05ms]   ↳ Bar × 100
      "
    `)
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

let nf = new Intl.NumberFormat(undefined, {
  style: 'decimal',
  minimumFractionDigits: 2,
})

function stabilize(output: string) {
  return stripVTControlCharacters(output).replace(/\[(\s*)(.*)\]/g, (_, whitespace, duration) => {
    let [value, unit] = dimensions.get(duration.trim())!
    return `[${whitespace}${nf.format(stableRound(value))}${unit}]`
  })
}

function stableRound(value: number) {
  if (value === 0) return 0

  let sign = Math.sign(value)
  let abs = Math.abs(value)

  let magnitude = 10 ** Math.floor(Math.log10(abs))

  let step = magnitude / 10
  if (abs < 0.1) step = 0.05

  return sign * Math.ceil(abs / step) * step
}
