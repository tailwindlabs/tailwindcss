import parseAnimationValue from '../src/util/parseAnimationValue'

describe('Tailwind Defaults', () => {
  it.each([
    [
      'spin 1s linear infinite',
      {
        value: 'spin 1s linear infinite',
        name: 'spin',
        duration: '1s',
        timingFunction: 'linear',
        iterationCount: 'infinite',
      },
    ],
    [
      'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      {
        value: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        name: 'ping',
        duration: '1s',
        timingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
        iterationCount: 'infinite',
      },
    ],
    [
      'bounce 1s infinite',
      {
        value: 'bounce 1s infinite',
        name: 'bounce',
        duration: '1s',
        iterationCount: 'infinite',
      },
    ],
  ])('should be possible to parse: "%s"', (input, expected) => {
    const parsed = parseAnimationValue(input)
    expect(parsed).toHaveLength(1)
    expect(parsed[0]).toEqual(expected)
  })
})

describe('css variables', () => {
  it('should be possible to use css variables', () => {
    let parsed = parseAnimationValue('jump var(--animation-duration, 10s) linear infinite')
    expect(parsed[0]).toEqual({
      value: 'jump var(--animation-duration, 10s) linear infinite',
      name: 'jump',
      timingFunction: 'linear',
      iterationCount: 'infinite',
      unknown: ['var(--animation-duration, 10s)'],
    })
  })
})

describe('MDN Examples', () => {
  it.each([
    [
      '3s ease-in 1s 2 reverse both paused slidein',
      {
        value: '3s ease-in 1s 2 reverse both paused slidein',
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
      {
        value: 'slidein 3s linear 1s',
        delay: '1s',
        duration: '3s',
        name: 'slidein',
        timingFunction: 'linear',
      },
    ],
    ['slidein 3s', { value: 'slidein 3s', duration: '3s', name: 'slidein' }],
  ])('should be possible to parse: "%s"', (input, expected) => {
    const parsed = parseAnimationValue(input)
    expect(parsed).toHaveLength(1)
    expect(parsed[0]).toEqual(expected)
  })
})

describe('duration & delay', () => {
  it.each([
    // Positive seconds (integer)
    ['spin 2s 1s linear', { duration: '2s', delay: '1s' }],

    // Negative seconds (integer)
    ['spin -2s -1s linear', { duration: '-2s', delay: '-1s' }],

    // Positive seconds (float)
    ['spin 2.321s 1.321s linear', { duration: '2.321s', delay: '1.321s' }],

    // Negative seconds (float)
    ['spin -2.321s -1.321s linear', { duration: '-2.321s', delay: '-1.321s' }],

    // Positive milliseconds (integer)
    ['spin 200ms 100ms linear', { duration: '200ms', delay: '100ms' }],

    // Negative milliseconds (integer)
    ['spin -200ms -100ms linear', { duration: '-200ms', delay: '-100ms' }],

    // Positive milliseconds (float)
    ['spin 200.321ms 100.321ms linear', { duration: '200.321ms', delay: '100.321ms' }],

    // Negative milliseconds (float)
    ['spin -200.321ms -100.321ms linear', { duration: '-200.321ms', delay: '-100.321ms' }],
  ])('should be possible to parse "%s" into %o', (input, { duration, delay }) => {
    const parsed = parseAnimationValue(input)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].duration).toEqual(duration)
    expect(parsed[0].delay).toEqual(delay)
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
      const parsed = parseAnimationValue(input)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].iterationCount).toEqual(iterationCount)
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
      {
        value: 'spin 1s linear infinite',
        name: 'spin',
        duration: '1s',
        timingFunction: 'linear',
        iterationCount: 'infinite',
      },
      {
        value: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        name: 'ping',
        duration: '1s',
        timingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
        iterationCount: 'infinite',
      },
      {
        value: 'pulse 2s cubic-bezier(0.4, 0, 0.6) infinite',
        name: 'pulse',
        duration: '2s',
        timingFunction: 'cubic-bezier(0.4, 0, 0.6)',
        iterationCount: 'infinite',
      },
    ])
  })
})

it.each`
  input                                                           | value                                                       | direction    | playState    | fillMode       | iterationCount | timingFunction | duration | delay   | name
  ${'1s spin 1s infinite'}                                        | ${'1s spin 1s infinite'}                                    | ${undefined} | ${undefined} | ${undefined}   | ${'infinite'}  | ${undefined}   | ${'1s'}  | ${'1s'} | ${'spin'}
  ${'infinite infinite 1s 1s'}                                    | ${'infinite infinite 1s 1s'}                                | ${undefined} | ${undefined} | ${undefined}   | ${'infinite'}  | ${undefined}   | ${'1s'}  | ${'1s'} | ${'infinite'}
  ${'ease 1s ease 1s'}                                            | ${'ease 1s ease 1s'}                                        | ${undefined} | ${undefined} | ${undefined}   | ${undefined}   | ${'ease'}      | ${'1s'}  | ${'1s'} | ${'ease'}
  ${'normal paused backwards infinite ease-in 1s 2s name'}        | ${'normal paused backwards infinite ease-in 1s 2s name'}    | ${'normal'}  | ${'paused'}  | ${'backwards'} | ${'infinite'}  | ${'ease-in'}   | ${'1s'}  | ${'2s'} | ${'name'}
  ${'paused backwards infinite ease-in 1s 2s name normal'}        | ${'paused backwards infinite ease-in 1s 2s name normal'}    | ${'normal'}  | ${'paused'}  | ${'backwards'} | ${'infinite'}  | ${'ease-in'}   | ${'1s'}  | ${'2s'} | ${'name'}
  ${'backwards infinite ease-in 1s 2s name normal paused'}        | ${'backwards infinite ease-in 1s 2s name normal paused'}    | ${'normal'}  | ${'paused'}  | ${'backwards'} | ${'infinite'}  | ${'ease-in'}   | ${'1s'}  | ${'2s'} | ${'name'}
  ${'infinite ease-in 1s 2s name normal paused backwards'}        | ${'infinite ease-in 1s 2s name normal paused backwards'}    | ${'normal'}  | ${'paused'}  | ${'backwards'} | ${'infinite'}  | ${'ease-in'}   | ${'1s'}  | ${'2s'} | ${'name'}
  ${'ease-in 1s 2s name normal paused backwards infinite'}        | ${'ease-in 1s 2s name normal paused backwards infinite'}    | ${'normal'}  | ${'paused'}  | ${'backwards'} | ${'infinite'}  | ${'ease-in'}   | ${'1s'}  | ${'2s'} | ${'name'}
  ${'1s 2s name normal paused backwards infinite ease-in'}        | ${'1s 2s name normal paused backwards infinite ease-in'}    | ${'normal'}  | ${'paused'}  | ${'backwards'} | ${'infinite'}  | ${'ease-in'}   | ${'1s'}  | ${'2s'} | ${'name'}
  ${'2s name normal paused backwards infinite ease-in 1s'}        | ${'2s name normal paused backwards infinite ease-in 1s'}    | ${'normal'}  | ${'paused'}  | ${'backwards'} | ${'infinite'}  | ${'ease-in'}   | ${'2s'}  | ${'1s'} | ${'name'}
  ${'name normal paused backwards infinite ease-in 1s 2s'}        | ${'name normal paused backwards infinite ease-in 1s 2s'}    | ${'normal'}  | ${'paused'}  | ${'backwards'} | ${'infinite'}  | ${'ease-in'}   | ${'1s'}  | ${'2s'} | ${'name'}
  ${'  name   normal  paused backwards infinite ease-in 1s 2s  '} | ${'name   normal  paused backwards infinite ease-in 1s 2s'} | ${'normal'}  | ${'paused'}  | ${'backwards'} | ${'infinite'}  | ${'ease-in'}   | ${'1s'}  | ${'2s'} | ${'name'}
`('should parse "$input" correctly', ({ input, ...expected }) => {
  let parsed = parseAnimationValue(input)
  expect(parsed).toHaveLength(1)
  expect(parsed[0]).toEqual(expected)
})
