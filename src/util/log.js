import chalk from 'chalk'

export default {
  info(messages) {
    console.log('')
    messages.forEach(message => {
      console.log(chalk.bold.cyan('info'), '-', message)
    })
  },
  warn(messages) {
    console.log('')
    messages.forEach(message => {
      console.log(chalk.bold.yellow('warn'), '-', message)
    })
  },
  risk(messages) {
    console.log('')
    messages.forEach(message => {
      console.log(chalk.bold.magenta('risk'), '-', message)
    })
  },
}
