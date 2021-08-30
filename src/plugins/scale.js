import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('scale', [
    [
      'scale',
      [
        ['@defaults transform', {}],
        '--tw-scale-x',
        '--tw-scale-y',
        ['transform', 'var(--tw-transform)'],
      ],
    ],
    [
      [
        'scale-x',
        [['@defaults transform', {}], '--tw-scale-x', ['transform', 'var(--tw-transform)']],
      ],
      [
        'scale-y',
        [['@defaults transform', {}], '--tw-scale-y', ['transform', 'var(--tw-transform)']],
      ],
    ],
  ])
}
