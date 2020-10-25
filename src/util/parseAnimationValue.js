const DIRECTIONS = new Set(['normal', 'reverse', 'alternate', 'alternate-reverse'])
const PLAY_STATES = new Set(['running', 'paused'])
const FILL_MODES = new Set(['none', 'forwards', 'backwards', 'both'])
const ITERATION_COUNTS = new Set(['infinite'])
const TIMINGS = new Set(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'])
const TIMING_FNS = ['cubic-bezier', 'steps']

const COMMA = /\,(?![^(]*\))/g // Comma separator that is not located between brackets. E.g.: `cubiz-bezier(a, b, c)` these don't count.
const SPACE = /\ (?![^(]*\))/g // Similar to the one above, but with spaces instead.
const TIME = /^(-?[\d.]+m?s)$/
const DIGIT = /^(\d+)$/

export default function parseAnimationValue(input) {
  const animations = input.split(COMMA)
  const result = animations.map((animation) => {
    const result = {}
    const parts = animation.split(SPACE)

    for (let part of parts) {
      if (DIRECTIONS.has(part)) result.direction = part
      else if (PLAY_STATES.has(part)) result.playState = part
      else if (FILL_MODES.has(part)) result.fillMode = part
      else if (ITERATION_COUNTS.has(part)) result.iterationCount = part
      else if (TIMINGS.has(part)) result.timingFunction = part
      else if (TIMING_FNS.some((f) => part.startsWith(`${f}(`))) result.timingFunction = part
      else if (TIME.test(part)) result[result.duration === undefined ? 'duration' : 'delay'] = part
      else if (DIGIT.test(part)) result.iterationCount = part
      else result.name = part
    }

    return result
  })

  return animations.length > 1 ? result : result[0]
}
