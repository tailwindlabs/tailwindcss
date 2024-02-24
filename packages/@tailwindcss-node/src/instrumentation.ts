import { DefaultMap } from '../../tailwindcss/src/utils/default-map'

const hits = new DefaultMap(() => ({ value: 0 }))
const timerStack: {
  id: string
  label: string
  namespace: string
  value: bigint
}[] = []
const timers = new DefaultMap(() => ({ value: 0n }))

export function hit(label: string) {
  hits.get(label).value++
}

export function start(label: string) {
  let namespace = timerStack.map((t) => t.label).join('//')
  let id = `${namespace}${namespace.length === 0 ? '' : '//'}${label}`

  hits.get(id).value++

  // Create the timer if it doesn't exist yet
  timers.get(id)

  timerStack.push({ id, label, namespace, value: process.hrtime.bigint() })
}

export function end(label: string) {
  let end = process.hrtime.bigint()

  if (timerStack[timerStack.length - 1].label !== label) {
    throw new Error(
      `Mismatched timer label: \`${label}\`, expected \`${
        timerStack[timerStack.length - 1].label
      }\``,
    )
  }

  let parent = timerStack.pop()!
  let elapsed = end - parent.value
  timers.get(parent.id).value += elapsed
}

export function reset() {
  hits.clear()
  timers.clear()
  timerStack.splice(0)
}

function white(input: string) {
  return `\u001b[37m${input}\u001b[39m`
}

function dim(input: string) {
  return `\u001b[2m${input}\u001b[22m`
}

function blue(input: string) {
  return `\u001b[34m${input}\u001b[39m`
}

export function report(flush = console.error) {
  let output: string[] = []
  let hasHits = false

  // Auto end any pending timers
  for (let i = timerStack.length - 1; i >= 0; i--) {
    end(timerStack[i].label)
  }

  for (let [label, { value: count }] of hits.entries()) {
    if (timers.has(label)) continue
    if (output.length === 0) {
      hasHits = true
      output.push(white('Hits:'))
    }

    let depth = label.split('//').length
    output.push(`${'  '.repeat(depth)}${label} ${dim(blue(`× ${count}`))}`)
  }

  if (timers.size > 0 && hasHits) {
    output.push(white('\nTimers:'))
  }

  let max = -Infinity
  let computed = new Map<string, string>()
  for (let [label, { value }] of timers) {
    let x = `${(Number(value) / 1e6).toFixed(2)}ms`
    computed.set(label, x)
    max = Math.max(max, x.length)
  }

  for (let label of timers.keys()) {
    let depth = label.split('//').length
    output.push(
      white(
        `${dim(`[${computed.get(label)!.padStart(max, ' ')}]`)}${'  '.repeat(depth - 1)}${depth === 1 ? ' ' : ' ↳ '}${label.split('//').pop()} ${
          hits.get(label).value === 1 ? '' : dim(blue(`× ${hits.get(label).value}`))
        }`.trimEnd(),
      ),
    )
  }

  flush(output.join('\n'))
}
