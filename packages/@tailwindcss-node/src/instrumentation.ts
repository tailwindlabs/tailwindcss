import { DefaultMap } from '../../tailwindcss/src/utils/default-map'
import * as env from './env'

// See: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#:~:text=Symbol.dispose,-??=%20Symbol(%22Symbol.dispose
// @ts-expect-error — Ensure Symbol.dispose exists
Symbol.dispose ??= Symbol('Symbol.dispose')
// @ts-expect-error — Ensure Symbol.asyncDispose exists
Symbol.asyncDispose ??= Symbol('Symbol.asyncDispose')

export class Instrumentation implements Disposable {
  #hits = new DefaultMap(() => ({ value: 0 }))
  #timers = new DefaultMap(() => ({ value: 0n }))
  #timerStack: { id: string; label: string; namespace: string; value: bigint }[] = []

  constructor(
    private defaultFlush = (message: string) => void process.stderr.write(`${message}\n`),
  ) {}

  hit(label: string) {
    this.#hits.get(label).value++
  }

  start(label: string) {
    let namespace = this.#timerStack.map((t) => t.label).join('//')
    let id = `${namespace}${namespace.length === 0 ? '' : '//'}${label}`

    this.#hits.get(id).value++

    // Create the timer if it doesn't exist yet
    this.#timers.get(id)

    this.#timerStack.push({ id, label, namespace, value: process.hrtime.bigint() })
  }

  end(label: string) {
    let end = process.hrtime.bigint()

    if (this.#timerStack[this.#timerStack.length - 1].label !== label) {
      throw new Error(
        `Mismatched timer label: \`${label}\`, expected \`${
          this.#timerStack[this.#timerStack.length - 1].label
        }\``,
      )
    }

    let parent = this.#timerStack.pop()!
    let elapsed = end - parent.value
    this.#timers.get(parent.id).value += elapsed
  }

  reset() {
    this.#hits.clear()
    this.#timers.clear()
    this.#timerStack.splice(0)
  }

  report(flush = this.defaultFlush) {
    let output: string[] = []
    let hasHits = false

    // Auto end any pending timers
    for (let i = this.#timerStack.length - 1; i >= 0; i--) {
      this.end(this.#timerStack[i].label)
    }

    for (let [label, { value: count }] of this.#hits.entries()) {
      if (this.#timers.has(label)) continue
      if (output.length === 0) {
        hasHits = true
        output.push('Hits:')
      }

      let depth = label.split('//').length
      output.push(`${'  '.repeat(depth)}${label} ${dim(blue(`× ${count}`))}`)
    }

    if (this.#timers.size > 0 && hasHits) {
      output.push('\nTimers:')
    }

    let max = -Infinity
    let computed = new Map<string, string>()
    for (let [label, { value }] of this.#timers) {
      let x = `${(Number(value) / 1e6).toFixed(2)}ms`
      computed.set(label, x)
      max = Math.max(max, x.length)
    }

    for (let label of this.#timers.keys()) {
      let depth = label.split('//').length
      output.push(
        `${dim(`[${computed.get(label)!.padStart(max, ' ')}]`)}${'  '.repeat(depth - 1)}${depth === 1 ? ' ' : dim(' ↳ ')}${label.split('//').pop()} ${
          this.#hits.get(label).value === 1 ? '' : dim(blue(`× ${this.#hits.get(label).value}`))
        }`.trimEnd(),
      )
    }

    flush(`\n${output.join('\n')}\n`)
    this.reset()
  }

  [Symbol.dispose]() {
    env.DEBUG && this.report()
  }
}

function dim(input: string) {
  return `\u001b[2m${input}\u001b[22m`
}

function blue(input: string) {
  return `\u001b[34m${input}\u001b[39m`
}
