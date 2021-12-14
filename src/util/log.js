import chalk from 'chalk'

let alreadyShown = new Set()

function log(chalk, messages, key) {
  if (process.env.JEST_WORKER_ID !== undefined) return

  if (key && alreadyShown.has(key)) return
  if (key) alreadyShown.add(key)

  console.warn('')
  messages.forEach((message) => console.warn(chalk, '-', message))
}

export function dim(input) {
  return chalk.dim(input)
}

export default {
  info(key, messages) {
    log(chalk.bold.cyan('info'), ...(Array.isArray(key) ? [key] : [messages, key]))
  },
  warn(key, messages) {
    log(chalk.bold.yellow('warn'), ...(Array.isArray(key) ? [key] : [messages, key]))
  },
  risk(key, messages) {
    log(chalk.bold.magenta('risk'), ...(Array.isArray(key) ? [key] : [messages, key]))
  },
}
