import colors from 'picocolors'

let alreadyShown = new Set()

function log(type, messages, key) {
  if (typeof process !== 'undefined' && process.env.JEST_WORKER_ID) return

  if (key && alreadyShown.has(key)) return
  if (key) alreadyShown.add(key)

  console.warn('')
  messages.forEach((message) => console.warn(type, '-', message))
}

export function dim(input) {
  return colors.dim(input)
}

export default {
  group(key, cb) {
    if (typeof process !== 'undefined' && process.env.JEST_WORKER_ID) return

    if (key && alreadyShown.has(key)) return
    if (key) alreadyShown.add(key)

    console.warn('')

    cb({
      info(messages) {
        messages.forEach((message) => console.warn(colors.bold(colors.cyan('info')), '-', message))
      },
      warn(messages) {
        messages.forEach((message) =>
          console.warn(colors.bold(colors.yellow('warn')), '-', message)
        )
      },
      risk(messages) {
        messages.forEach((message) =>
          console.warn(colors.bold(colors.magenta('risk')), '-', message)
        )
      },
    })
  },
  info(key, messages) {
    log(colors.bold(colors.cyan('info')), ...(Array.isArray(key) ? [key] : [messages, key]))
  },
  warn(key, messages) {
    log(colors.bold(colors.yellow('warn')), ...(Array.isArray(key) ? [key] : [messages, key]))
  },
  risk(key, messages) {
    log(colors.bold(colors.magenta('risk')), ...(Array.isArray(key) ? [key] : [messages, key]))
  },
}
