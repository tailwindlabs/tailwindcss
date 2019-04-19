import chalk from 'chalk'

/**
 * Applies colors to emphasize
 *
 * @param {...string} msgs
 */
export const bold = (...msgs) => chalk.bold(...msgs)

/**
 * Applies colors to inform
 *
 * @param {...string} msgs
 */
export const info = (...msgs) => chalk.bold.cyan(...msgs)

/**
 * Applies colors to signify error
 *
 * @param {...string} msgs
 */
export const error = (...msgs) => chalk.bold.red(...msgs)

/**
 * Applies colors to represent a command
 *
 * @param {...string} msgs
 */
export const command = (...msgs) => chalk.bold.magenta(...msgs)

/**
 * Applies colors to represent a file
 *
 * @param {...string} msgs
 */
export const file = (...msgs) => chalk.bold.magenta(...msgs)
