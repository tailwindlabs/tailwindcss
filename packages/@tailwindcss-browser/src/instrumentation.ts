export class Instrumentation {
  start(label: string) {
    performance.mark(`${label} (start)`)
  }

  end(label: string, detail?: any) {
    performance.mark(`${label} (end)`)

    performance.measure(label, {
      start: `${label} (start)`,
      end: `${label} (end)`,
      detail,
    })
  }

  hit(label: string, detail?: any) {
    performance.mark(label, {
      detail,
    })
  }

  error(error: any) {
    performance.mark(`(error)`, {
      detail: { error: `${error}` },
    })

    throw error
  }
}
