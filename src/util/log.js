import chalk from 'chalk'

export default {
  info(messages) {
    if (process.env.JEST_WORKER_ID !== undefined) return

    console.warn('')
    messages.forEach((message) => {
      console.warn(chalk.bold.cyan('info'), '-', message)
    })
  },
  warn(messages) {
    if (process.env.JEST_WORKER_ID !== undefined) return

    console.warn('')
    messages.forEach((message) => {
      console.warn(chalk.bold.yellow('warn'), '-', message)
    })
  },
  risk(messages) {
    if (process.env.JEST_WORKER_ID !== undefined) return

    console.warn('')
    messages.forEach((message) => {
      console.warn(chalk.bold.magenta('risk'), '-', message)
    })
  },
}
