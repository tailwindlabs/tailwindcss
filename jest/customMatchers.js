const prettier = require('prettier')
const { diff } = require('jest-diff')
const log = require('../src/util/log').default
const { version } = require('../package.json')

function license() {
  return `/* ! tailwindcss v${version} | MIT License | https://tailwindcss.com */\n`
}

let warn

beforeEach(() => {
  warn = jest.spyOn(log, 'warn')
  warn.mockImplementation(() => {})
})

afterEach(() => {
  warn.mockRestore()
})

function formatPrettier(input) {
  return prettier.format(input, {
    parser: 'css',
    printWidth: 100,
  })
}

function format(input) {
  return formatPrettier(input).replace(/\n{2,}/g, '\n')
}

function toMatchFormattedCss(received = '', argument = '') {
  let options = {
    comment: 'formatCSS(received) === formatCSS(argument)',
    isNot: this.isNot,
    promise: this.promise,
  }

  // Drop the license from the tests such that we can purely focus on the actual CSS being
  // generated.
  received = received.replace(license(), '')
  argument = argument.replace(license(), '')

  let formattedReceived = format(received)
  let formattedArgument = format(argument)

  let pass = formattedReceived === formattedArgument

  let message = pass
    ? () => {
        return (
          this.utils.matcherHint('toMatchFormattedCss', undefined, undefined, options) +
          '\n\n' +
          `Expected: not ${this.utils.printExpected(formattedReceived)}\n` +
          `Received: ${this.utils.printReceived(formattedArgument)}`
        )
      }
    : () => {
        let diffString = diff(formattedArgument, formattedReceived, {
          expand: this.expand,
        })

        return (
          this.utils.matcherHint('toMatchFormattedCss', undefined, undefined, options) +
          '\n\n' +
          (diffString && diffString.includes('- Expect')
            ? `Difference:\n\n${diffString}`
            : `Expected: ${this.utils.printExpected(formattedArgument)}\n` +
              `Received: ${this.utils.printReceived(formattedReceived)}`)
        )
      }

  return { actual: received, message, pass }
}

expect.extend({
  toMatchFormattedCss: toMatchFormattedCss,
  toIncludeCss(received, argument) {
    let options = {
      comment: 'formatCSS(received).includes(formatCSS(argument))',
      isNot: this.isNot,
      promise: this.promise,
    }

    let pass = format(received).includes(format(argument))

    let message = pass
      ? () => {
          return (
            this.utils.matcherHint('toIncludeCss', undefined, undefined, options) +
            '\n\n' +
            `Expected: not ${this.utils.printExpected(formatPrettier(received))}\n` +
            `Received: ${this.utils.printReceived(formatPrettier(argument))}`
          )
        }
      : () => {
          let actual = formatPrettier(received)
          let expected = formatPrettier(argument)

          let diffString = diff(expected, actual, {
            expand: this.expand,
          })

          return (
            this.utils.matcherHint('toIncludeCss', undefined, undefined, options) +
            '\n\n' +
            (diffString && diffString.includes('- Expect')
              ? `Difference:\n\n${diffString}`
              : `Expected: ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(actual)}`)
          )
        }

    return { actual: received, message, pass }
  },
  toHaveBeenWarned() {
    let passed = warn.mock.calls.length > 0
    if (passed) {
      return {
        pass: true,
        message: () => {
          return (
            this.utils.matcherHint('toHaveBeenWarned') +
            '\n\n' +
            `Expected number of calls: >= ${this.utils.printExpected(1)}\n` +
            `Received number of calls:    ${this.utils.printReceived(actualWarningKeys.length)}`
          )
        },
      }
    } else {
      return {
        pass: false,
        message: () => {
          return (
            this.utils.matcherHint('toHaveBeenWarned') +
            '\n\n' +
            `Expected number of calls: >= ${this.utils.printExpected(1)}\n` +
            `Received number of calls:    ${this.utils.printReceived(warn.mock.calls.length)}`
          )
        },
      }
    }
  },
  toHaveBeenWarnedWith(_received, expectedWarningKeys) {
    let actualWarningKeys = warn.mock.calls.map((args) => args[0])

    let passed = expectedWarningKeys.every((key) => actualWarningKeys.includes(key))
    if (passed) {
      return {
        pass: true,
        message: () => {
          return (
            this.utils.matcherHint('toHaveBeenWarnedWith') +
            '\n\n' +
            `Expected: not ${this.utils.printExpected(expectedWarningKeys)}\n` +
            `Received: ${this.utils.printReceived(actualWarningKeys)}`
          )
        },
      }
    } else {
      let diffString = diff(expectedWarningKeys, actualWarningKeys)

      return {
        pass: false,
        message: () => {
          return (
            this.utils.matcherHint('toHaveBeenWarnedWith') +
            '\n\n' +
            (diffString && diffString.includes('- Expect')
              ? `Difference:\n\n${diffString}`
              : `Expected: ${this.utils.printExpected(expectedWarningKeys)}\n` +
                `Received: ${this.utils.printReceived(actualWarningKeys)}`)
          )
        },
      }
    }
  },
})
