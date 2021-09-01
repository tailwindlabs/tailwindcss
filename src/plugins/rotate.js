import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('rotate', [
    ['rotate', [['@defaults transform', {}], '--tw-rotate', ['transform', 'var(--tw-transform)']]],
  ])
}
