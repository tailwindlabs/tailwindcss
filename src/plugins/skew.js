import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('skew', [
    [
      [
        'skew-x',
        [['@defaults transform', {}], '--tw-skew-x', ['transform', 'var(--tw-transform)']],
      ],
      [
        'skew-y',
        [['@defaults transform', {}], '--tw-skew-y', ['transform', 'var(--tw-transform)']],
      ],
    ],
  ])
}
