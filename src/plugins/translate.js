import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('translate', [
    [
      [
        'translate-x',
        [['@defaults transform', {}], '--tw-translate-x', ['transform', 'var(--tw-transform)']],
      ],
      [
        'translate-y',
        [['@defaults transform', {}], '--tw-translate-y', ['transform', 'var(--tw-transform)']],
      ],
    ],
  ])
}
