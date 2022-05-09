const { parseCandidate } = require('../src/lib/candidate.js')

it.each([
  [
    'border',
    [
      {
        raw: 'border',
        className: '.border',
        withoutVariants: 'border',
        important: false,
        negative: false,
        prefix: '',
        variants: [],
        type: 'constrained',
        plugins: [{ plugin: 'border', value: 'DEFAULT', modifiers: [] }],
      },
    ],
  ],
  [
    'w-4',
    [
      {
        raw: 'w-4',
        className: '.w-4',
        withoutVariants: 'w-4',
        important: false,
        negative: false,
        prefix: '',
        variants: [],
        type: 'constrained',
        plugins: [
          { plugin: 'w-4', value: 'DEFAULT', modifiers: [] },
          { plugin: 'w', value: '4', modifiers: [] },
        ],
      },
    ],
  ],
  [
    '-w-4',
    [
      {
        raw: '-w-4',
        className: '.-w-4',
        withoutVariants: '-w-4',
        important: false,
        negative: true,
        prefix: '',
        variants: [],
        type: 'constrained',
        plugins: [
          { plugin: 'w-4', value: '-DEFAULT', modifiers: [] },
          { plugin: 'w', value: '-4', modifiers: [] },
        ],
      },
    ],
  ],
  [
    'sm:w',
    [
      {
        raw: 'sm:w',
        className: '.sm\\:w',
        withoutVariants: 'w',
        important: false,
        negative: false,
        prefix: '',
        variants: [{ raw: 'sm', type: 'constrained', name: 'sm' }],
        type: 'constrained',
        plugins: [{ plugin: 'w', value: 'DEFAULT', modifiers: [] }],
      },
    ],
  ],
  [
    'w-[2px]',
    [
      {
        raw: 'w-[2px]',
        className: '.w-\\[2px\\]',
        withoutVariants: 'w-[2px]',
        important: false,
        negative: false,
        prefix: '',
        variants: [],
        type: 'constrained',
        plugins: [
          { plugin: 'w-[2px]', value: 'DEFAULT', modifiers: [] },
          { plugin: 'w', value: '[2px]', modifiers: [] },
          {
            plugin: 'w',
            value: {
              raw: '[2px]',
              value: '2px',
              dataType: 'any',
            },
            modifiers: [],
          },
        ],
      },
    ],
  ],
  [
    '-mt-[10px]',
    [
      {
        raw: '-mt-[10px]',
        className: '.-mt-\\[10px\\]',
        withoutVariants: '-mt-[10px]',
        important: false,
        negative: true,
        prefix: '',
        variants: [],
        type: 'constrained',
        plugins: [
          { plugin: 'mt-[10px]', value: '-DEFAULT', modifiers: [] },
          { plugin: 'mt', value: '-[10px]', modifiers: [] },
          {
            plugin: 'mt',
            value: {
              raw: '[10px]',
              value: '10px',
              dataType: 'any',
            },
            modifiers: [],
          },
        ],
      },
    ],
  ],
  [
    'sm:w-[2px]',
    [
      {
        raw: 'sm:w-[2px]',
        className: '.sm\\:w-\\[2px\\]',
        withoutVariants: 'w-[2px]',
        important: false,
        negative: false,
        prefix: '',
        variants: [{ raw: 'sm', type: 'constrained', name: 'sm' }],
        type: 'constrained',
        plugins: [
          { plugin: 'w-[2px]', value: 'DEFAULT', modifiers: [] },
          { plugin: 'w', value: '[2px]', modifiers: [] },
          {
            plugin: 'w',
            value: {
              raw: '[2px]',
              value: '2px',
              dataType: 'any',
            },
            modifiers: [],
          },
        ],
      },
    ],
  ],
  [
    'sm:w-[length:2px]',
    [
      {
        raw: 'sm:w-[length:2px]',
        className: '.sm\\:w-\\[length\\:2px\\]',
        withoutVariants: 'w-[length:2px]',
        important: false,
        negative: false,
        prefix: '',
        variants: [{ raw: 'sm', type: 'constrained', name: 'sm' }],
        type: 'constrained',
        plugins: [
          { plugin: 'w-[length:2px]', value: 'DEFAULT', modifiers: [] },
          { plugin: 'w', value: '[length:2px]', modifiers: [] },
          {
            plugin: 'w',
            value: {
              raw: '[length:2px]',
              value: '2px',
              dataType: 'length',
            },
            modifiers: [],
          },
        ],
      },
    ],
  ],
  [
    'sm:w-[2px]/20',
    [
      {
        raw: 'sm:w-[2px]/20',
        className: '.sm\\:w-\\[2px\\]\\/20',
        withoutVariants: 'w-[2px]/20',
        important: false,
        negative: false,
        prefix: '',
        variants: [{ raw: 'sm', type: 'constrained', name: 'sm' }],
        type: 'constrained',
        plugins: [
          { plugin: 'w-[2px]/20', value: 'DEFAULT', modifiers: [] },
          { plugin: 'w', value: '[2px]/20', modifiers: [] },
          {
            plugin: 'w',
            value: '[2px]',
            modifiers: [{ raw: '20', value: '20' }],
          },
          {
            plugin: 'w',
            value: {
              raw: `[2px]`,
              value: '2px',
              dataType: 'any',
            },
            modifiers: [{ raw: '20', value: '20' }],
          },
        ],
      },
    ],
  ],
  [
    'bg-red-500/50',
    [
      {
        raw: 'bg-red-500/50',
        className: '.bg-red-500\\/50',
        withoutVariants: 'bg-red-500/50',
        important: false,
        negative: false,
        prefix: '',
        variants: [],
        type: 'constrained',
        plugins: [
          { plugin: 'bg-red-500/50', value: 'DEFAULT', modifiers: [] },
          { plugin: 'bg-red', value: '500/50', modifiers: [] },
          { plugin: 'bg-red', value: '500', modifiers: [{ raw: '50', value: '50' }] },
          { plugin: 'bg', value: 'red-500/50', modifiers: [] },
          { plugin: 'bg', value: 'red-500', modifiers: [{ raw: '50', value: '50' }] },
        ],
      },
    ],
  ],
  [
    'bg-[url(https://example.com/image.png)]',
    [
      {
        raw: 'bg-[url(https://example.com/image.png)]',
        className: '.bg-\\[url\\(https\\:\\/\\/example\\.com\\/image\\.png\\)\\]',
        withoutVariants: 'bg-[url(https://example.com/image.png)]',
        important: false,
        negative: false,
        prefix: '',
        variants: [],
        type: 'constrained',
        plugins: [
          { plugin: 'bg-[url(https://example.com/image.png)]', value: 'DEFAULT', modifiers: [] },
          { plugin: 'bg', value: '[url(https://example.com/image.png)]', modifiers: [] },
          {
            plugin: 'bg',
            value: {
              raw: `[url(https://example.com/image.png)]`,
              value: 'url(https://example.com/image.png)',
              dataType: 'any',
            },
            modifiers: [],
          },
        ],
      },
    ],
  ],
  [
    'bg-[color:]',
    [
      {
        raw: 'bg-[color:]',
        className: '.bg-\\[color\\:\\]',
        withoutVariants: 'bg-[color:]',
        important: false,
        negative: false,
        prefix: '',
        variants: [],
        type: 'constrained',
        plugins: [
          { plugin: 'bg-[color:]', value: 'DEFAULT', modifiers: [] },
          { plugin: 'bg', value: '[color:]', modifiers: [] },
          // [color:] is not a valid arbitrary value
        ],
      },
    ],
  ],
  [
    '-mt-[10px]',
    [
      {
        raw: '-mt-[10px]',
        className: '.-mt-\\[10px\\]',
        withoutVariants: '-mt-[10px]',
        important: false,
        negative: true,
        prefix: '',
        variants: [],
        type: 'constrained',
        plugins: [
          { plugin: 'mt-[10px]', value: '-DEFAULT', modifiers: [] },
          { plugin: 'mt', value: '-[10px]', modifiers: [] },
          {
            plugin: 'mt',
            value: {
              raw: `[10px]`,
              value: '10px',
              dataType: 'any',
            },
            modifiers: [],
          },
        ],
      },
    ],
  ],
  [
    'sm:w-[2px]/[0.55]',
    [
      {
        raw: 'sm:w-[2px]/[0.55]',
        className: '.sm\\:w-\\[2px\\]\\/\\[0\\.55\\]',
        withoutVariants: 'w-[2px]/[0.55]',
        important: false,
        negative: false,
        prefix: '',
        variants: [{ raw: 'sm', type: 'constrained', name: 'sm' }],
        type: 'constrained',
        plugins: [
          { plugin: 'w-[2px]/[0.55]', value: 'DEFAULT', modifiers: [] },
          { plugin: 'w', value: '[2px]/[0.55]', modifiers: [] },
          {
            plugin: 'w',
            value: '[2px]',
            modifiers: [
              {
                raw: '[0.55]',
                value: {
                  raw: `[0.55]`,
                  value: '0.55',
                  dataType: 'any',
                },
              },
            ],
          },
          {
            plugin: 'w',
            value: {
              raw: `[2px]`,
              value: '2px',
              dataType: 'any',
            },
            modifiers: [
              {
                raw: '[0.55]',
                value: {
                  raw: `[0.55]`,
                  value: '0.55',
                  dataType: 'any',
                },
              },
            ],
          },
        ],
      },
    ],
  ],
  [
    'sm:w-[calc(0.5rem_+_1px)]',
    [
      {
        raw: 'sm:w-[calc(0.5rem_+_1px)]',
        className: '.sm\\:w-\\[calc\\(0\\.5rem_\\+_1px\\)\\]',
        withoutVariants: 'w-[calc(0.5rem_+_1px)]',
        important: false,
        negative: false,
        prefix: '',
        variants: [{ raw: 'sm', type: 'constrained', name: 'sm' }],
        type: 'constrained',
        plugins: [
          { plugin: 'w-[calc(0.5rem_+_1px)]', value: 'DEFAULT', modifiers: [] },
          { plugin: 'w', value: '[calc(0.5rem_+_1px)]', modifiers: [] },
          {
            plugin: 'w',
            value: {
              raw: `[calc(0.5rem_+_1px)]`,
              value: 'calc(0.5rem + 1px)',
              dataType: 'any',
            },
            modifiers: [],
          },
        ],
      },
    ],
  ],
  [
    '[width:2px]',
    [
      {
        raw: '[width:2px]',
        className: '.\\[width\\:2px\\]',
        withoutVariants: '[width:2px]',
        important: false,
        negative: false,
        prefix: '',
        variants: [],
        modifiers: [],
        type: 'custom',
        name: 'width',
        value: '2px',
      },
    ],
  ],
  [
    'sm:[width:2px]',
    [
      {
        raw: 'sm:[width:2px]',
        className: '.sm\\:\\[width\\:2px\\]',
        withoutVariants: '[width:2px]',
        important: false,
        negative: false,
        prefix: '',
        variants: [{ raw: 'sm', type: 'constrained', name: 'sm' }],
        modifiers: [],
        type: 'custom',
        name: 'width',
        value: '2px',
      },
    ],
  ],
  [
    'sm:focus:[width:2px]',
    [
      {
        raw: 'sm:focus:[width:2px]',
        className: '.sm\\:focus\\:\\[width\\:2px\\]',
        withoutVariants: '[width:2px]',
        important: false,
        negative: false,
        prefix: '',
        variants: [
          { raw: 'focus', type: 'constrained', name: 'focus' },
          { raw: 'sm', type: 'constrained', name: 'sm' },
        ],
        modifiers: [],
        type: 'custom',
        name: 'width',
        value: '2px',
      },
    ],
  ],
  [
    'sm:[@media(min-width:200px)]:[width:2px]',
    [
      {
        raw: 'sm:[@media(min-width:200px)]:[width:2px]',
        className: '.sm\\:\\[\\@media\\(min-width\\:200px\\)\\]\\:\\[width\\:2px\\]',
        withoutVariants: '[width:2px]',
        important: false,
        negative: false,
        prefix: '',
        variants: [
          {
            type: 'custom',
            raw: '[@media(min-width:200px)]',
            value: '@media(min-width:200px)',
            dataType: 'any',
          },
          { raw: 'sm', type: 'constrained', name: 'sm' },
        ],
        modifiers: [],
        type: 'custom',
        name: 'width',
        value: '2px',
      },
    ],
  ],
  [
    'sm:group-[foo_bar]:underline',
    [
      {
        raw: 'sm:group-[foo_bar]:underline',
        className: '.sm\\:group-\\[foo_bar\\]\\:underline',
        withoutVariants: 'underline',
        important: false,
        negative: false,
        prefix: '',
        variants: [
          {
            type: 'partial',
            raw: 'group-[foo_bar]',
            name: 'group',
            value: 'foo bar',
            dataType: 'any',
          },
          { raw: 'sm', type: 'constrained', name: 'sm' },
        ],
        type: 'constrained',
        plugins: [{ plugin: 'underline', value: 'DEFAULT', modifiers: [] }],
      },
    ],
  ],
  [
    'bg-[hsl(var(--foo),var(--bar),var(--baz))]/50',
    [
      {
        raw: 'bg-[hsl(var(--foo),var(--bar),var(--baz))]/50',
        className: '.bg-\\[hsl\\(var\\(--foo\\)\\2c var\\(--bar\\)\\2c var\\(--baz\\)\\)\\]\\/50',
        withoutVariants: 'bg-[hsl(var(--foo),var(--bar),var(--baz))]/50',
        important: false,
        negative: false,
        prefix: '',
        variants: [],
        type: 'constrained',
        plugins: [
          {
            plugin: 'bg-[hsl(var(--foo),var(--bar),var(--baz))]/50',
            value: 'DEFAULT',
            modifiers: [],
          },
          {
            plugin: 'bg',
            value: '[hsl(var(--foo),var(--bar),var(--baz))]/50',
            modifiers: [],
          },
          {
            plugin: 'bg',
            value: '[hsl(var(--foo),var(--bar),var(--baz))]',
            modifiers: [{ raw: '50', value: '50' }],
          },
          {
            plugin: 'bg',
            value: {
              raw: '[hsl(var(--foo),var(--bar),var(--baz))]',
              value: 'hsl(var(--foo),var(--bar),var(--baz))',
              dataType: 'any',
            },
            modifiers: [{ raw: '50', value: '50' }],
          },
        ],
      },
    ],
  ],
  // TODO: test for `[color:#ff0000]/50`?
  ['[http://example.com]', []],
])('should be possible to parse: "%s"', (input, expected) => {
  let actual = parseCandidate(input, {
    tailwindConfig: {
      separator: ':',
    },
  })

  expect(actual).toEqual(expected)
})
