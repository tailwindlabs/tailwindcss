import parseAnimationValue from '../src/util/parseAnimationValue'
import { produce } from './util/produce'

describe('Tailwind Defaults', () => {
  it.each([
    [
      'spin 1s linear infinite',
      { name: 'spin', duration: '1s', timingFunction: 'linear', iterationCount: 'infinite' },
    ],
    [
      'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      {
        name: 'ping',
        duration: '1s',
        timingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
        iterationCount: 'infinite',
      },
    ],
    [
      'pulse 2s cubic-bezier(0.4, 0, 0.6) infinite',
      {
        name: 'pulse',
        duration: '2s',
        timingFunction: 'cubic-bezier(0.4, 0, 0.6)',
        iterationCount: 'infinite',
      },
    ],
    ['bounce 1s infinite', { name: 'bounce', duration: '1s', iterationCount: 'infinite' }],
  ])('should be possible to parse: "%s"', (input, expected) => {
    expect(parseAnimationValue(input)).toEqual(expected)
  })
})

describe('MDN Examples', () => {
  it.each([
    [
      '3s ease-in 1s 2 reverse both paused slidein',
      {
        delay: '1s',
        direction: 'reverse',
        duration: '3s',
        fillMode: 'both',
        iterationCount: '2',
        name: 'slidein',
        playState: 'paused',
        timingFunction: 'ease-in',
      },
    ],
    [
      'slidein 3s linear 1s',
      { delay: '1s', duration: '3s', name: 'slidein', timingFunction: 'linear' },
    ],
    ['slidein 3s', { duration: '3s', name: 'slidein' }],
  ])('should be possible to parse: "%s"', (input, expected) => {
    expect(parseAnimationValue(input)).toEqual(expected)
  })
})

describe('duration & delay', () => {
  it.each([
    // Positive seconds (integer)
    ['spin 1s 1s linear', { duration: '1s', delay: '1s' }],
    ['spin 2s 1s linear', { duration: '2s', delay: '1s' }],
    ['spin 1s 2s linear', { duration: '1s', delay: '2s' }],

    // Negative seconds (integer)
    ['spin -1s -1s linear', { duration: '-1s', delay: '-1s' }],
    ['spin -2s -1s linear', { duration: '-2s', delay: '-1s' }],
    ['spin -1s -2s linear', { duration: '-1s', delay: '-2s' }],

    // Positive seconds (float)
    ['spin 1.321s 1.321s linear', { duration: '1.321s', delay: '1.321s' }],
    ['spin 2.321s 1.321s linear', { duration: '2.321s', delay: '1.321s' }],
    ['spin 1.321s 2.321s linear', { duration: '1.321s', delay: '2.321s' }],

    // Negative seconds (float)
    ['spin -1.321s -1.321s linear', { duration: '-1.321s', delay: '-1.321s' }],
    ['spin -2.321s -1.321s linear', { duration: '-2.321s', delay: '-1.321s' }],
    ['spin -1.321s -2.321s linear', { duration: '-1.321s', delay: '-2.321s' }],

    // Positive milliseconds (integer)
    ['spin 100ms 100ms linear', { duration: '100ms', delay: '100ms' }],
    ['spin 200ms 100ms linear', { duration: '200ms', delay: '100ms' }],
    ['spin 100ms 200ms linear', { duration: '100ms', delay: '200ms' }],

    // Negative milliseconds (integer)
    ['spin -100ms -100ms linear', { duration: '-100ms', delay: '-100ms' }],
    ['spin -200ms -100ms linear', { duration: '-200ms', delay: '-100ms' }],
    ['spin -100ms -200ms linear', { duration: '-100ms', delay: '-200ms' }],

    // Positive milliseconds (float)
    ['spin 100.321ms 100.321ms linear', { duration: '100.321ms', delay: '100.321ms' }],
    ['spin 200.321ms 100.321ms linear', { duration: '200.321ms', delay: '100.321ms' }],
    ['spin 100.321ms 200.321ms linear', { duration: '100.321ms', delay: '200.321ms' }],

    // Negative milliseconds (float)
    ['spin -100.321ms -100.321ms linear', { duration: '-100.321ms', delay: '-100.321ms' }],
    ['spin -200.321ms -100.321ms linear', { duration: '-200.321ms', delay: '-100.321ms' }],
    ['spin -100.321ms -200.321ms linear', { duration: '-100.321ms', delay: '-200.321ms' }],
  ])('should be possible to parse "%s" into %o', (input, { duration, delay }) => {
    const parsed = parseAnimationValue(input)
    expect(parsed.duration).toEqual(duration)
    expect(parsed.delay).toEqual(delay)
  })
})

describe('iteration count', () => {
  it.each([
    // Number
    ['1 spin 200s 100s linear', '1'],
    ['spin 2 200s 100s linear', '2'],
    ['spin 200s 3 100s linear', '3'],
    ['spin 200s 100s 4 linear', '4'],
    ['spin 200s 100s linear 5', '5'],

    // Infinite
    ['infinite spin 200s 100s linear', 'infinite'],
    ['spin infinite 200s 100s linear', 'infinite'],
    ['spin 200s infinite 100s linear', 'infinite'],
    ['spin 200s 100s infinite linear', 'infinite'],
    ['spin 200s 100s linear infinite', 'infinite'],
  ])(
    'should be possible to parse "%s" with an iteraction count of "%s"',
    (input, iterationCount) => {
      expect(parseAnimationValue(input).iterationCount).toEqual(iterationCount)
    }
  )
})

describe('iteration count', () => {
  it.each([
    // Number
    ['1 spin 200s 100s linear', '1'],
    ['spin 2 200s 100s linear', '2'],
    ['spin 200s 3 100s linear', '3'],
    ['spin 200s 100s 4 linear', '4'],
    ['spin 200s 100s linear 5', '5'],
    ['100 spin 200s 100s linear', '100'],
    ['spin 200 200s 100s linear', '200'],
    ['spin 200s 300 100s linear', '300'],
    ['spin 200s 100s 400 linear', '400'],
    ['spin 200s 100s linear 500', '500'],

    // Infinite
    ['infinite spin 200s 100s linear', 'infinite'],
    ['spin infinite 200s 100s linear', 'infinite'],
    ['spin 200s infinite 100s linear', 'infinite'],
    ['spin 200s 100s infinite linear', 'infinite'],
    ['spin 200s 100s linear infinite', 'infinite'],
  ])(
    'should be possible to parse "%s" with an iteraction count of "%s"',
    (input, iterationCount) => {
      expect(parseAnimationValue(input).iterationCount).toEqual(iterationCount)
    }
  )
})

describe('multiple animations', () => {
  it('should be possible to parse multiple applications at once', () => {
    const input = [
      'spin 1s linear infinite',
      'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      'pulse 2s cubic-bezier(0.4, 0, 0.6) infinite',
    ].join(',')

    const parsed = parseAnimationValue(input)
    expect(parsed).toHaveLength(3)
    expect(parsed).toEqual([
      { name: 'spin', duration: '1s', timingFunction: 'linear', iterationCount: 'infinite' },
      {
        name: 'ping',
        duration: '1s',
        timingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
        iterationCount: 'infinite',
      },
      {
        name: 'pulse',
        duration: '2s',
        timingFunction: 'cubic-bezier(0.4, 0, 0.6)',
        iterationCount: 'infinite',
      },
    ])
  })
})

describe('randomized crazy big examples', () => {
  function reOrder(input, offset = 0) {
    return [...input.slice(offset), ...input.slice(0, offset)]
  }

  it.each(
    produce((choose) => {
      const direction = choose('normal', 'reverse', 'alternate', 'alternate-reverse')
      const playState = choose('running', 'paused')
      const fillMode = choose('none', 'forwards', 'backwards', 'both')
      const iterationCount = choose('infinite', '1', '100')
      const timingFunction = choose(
        'linear',
        'ease',
        'ease-in',
        'ease-out',
        'ease-in-out',
        'cubic-bezier(0, 0, 0.2, 1)',
        'steps(4, end)'
      )
      const name = choose('animation-name-a', 'animation-name-b')
      const inputArgs = [direction, playState, fillMode, iterationCount, timingFunction, name]
      const orderOffset = choose(...Array(inputArgs.length).keys())

      return [
        // Input
        reOrder(inputArgs, orderOffset).join(' '),

        // Output
        {
          direction,
          playState,
          fillMode,
          iterationCount,
          timingFunction,
          name,
        },
      ]
    })
  )('should be possible to parse "%s"', (input, output) => {
    expect(parseAnimationValue(input)).toEqual(output)
  })
})
