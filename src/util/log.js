import chalk from 'chalk'

export default {
  info(messages) {
    console.warn('')
    messages.forEach(message => {
      console.warn(chalk.bold.cyan('info'), '-', message)
    })
  },
  warn(messages) {
    console.warn('')
    messages.forEach(message => {
      console.warn(chalk.bold.yellow('warn'), '-', message)
    })
  },
  risk(messages) {
    console.warn('')
    messages.forEach(message => {
      console.warn(chalk.bold.magenta('risk'), '-', message)
    })
  },
  error(messages) {
    console.warn('')
    messages.forEach(message => {
      console.warn(chalk.bold.red('error'), '-', message)
    })
  },
}
