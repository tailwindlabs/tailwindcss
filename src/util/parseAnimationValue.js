const DIRECTIONS = new Set(['normal', 'reverse', 'alternate', 'alternate-reverse'])
const PLAY_STATES = new Set(['running', 'paused'])
const FILL_MODES = new Set(['none', 'forwards', 'backwards', 'both'])
const ITERATION_COUNTS = new Set(['infinite'])
const TIMINGS = new Set([
  'linear',
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'step-start',
  'step-end',
])
const TIMING_FNS = ['cubic-bezier', 'steps']

const COMMA = /\,(?![^(]*\))/g // Comma separator that is not located between brackets. E.g.: `cubiz-bezier(a, b, c)` these don't count.
const SPACE = /\ +(?![^(]*\))/g // Similar to the one above, but with spaces instead.
const TIME = /^(-?[\d.]+m?s)$/
const DIGIT = /^(\d+)$/

export default function parseAnimationValue(input) {
  let animations = input.split(COMMA)
  let result = animations.map((animation) => {
    let result = {}
    let parts = animation.trim().split(SPACE)
    let seen = new Set()

    for (let part of parts) {
      if (!seen.has('DIRECTIONS') && DIRECTIONS.has(part)) {
        result.direction = part
        seen.add('DIRECTIONS')
      } else if (!seen.has('PLAY_STATES') && PLAY_STATES.has(part)) {
        result.playState = part
        seen.add('PLAY_STATES')
      } else if (!seen.has('FILL_MODES') && FILL_MODES.has(part)) {
        result.fillMode = part
        seen.add('FILL_MODES')
      } else if (
        !seen.has('ITERATION_COUNTS') &&
        (ITERATION_COUNTS.has(part) || DIGIT.test(part))
      ) {
        result.iterationCount = part
        seen.add('ITERATION_COUNTS')
      } else if (!seen.has('TIMING_FUNCTION') && TIMINGS.has(part)) {
        result.timingFunction = part
        seen.add('TIMING_FUNCTION')
      } else if (!seen.has('TIMING_FUNCTION') && TIMING_FNS.some((f) => part.startsWith(`${f}(`))) {
        result.timingFunction = part
        seen.add('TIMING_FUNCTION')
      } else if (!seen.has('DURATION') && TIME.test(part)) {
        result.duration = part
        seen.add('DURATION')
      } else if (!seen.has('DELAY') && TIME.test(part)) {
        result.delay = part
        seen.add('DELAY')
      } else result.name = part
    }

    return result
  })

  return animations.length > 1 ? result : result[0]
}
