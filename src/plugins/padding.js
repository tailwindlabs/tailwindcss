import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('padding', [
    ['p', ['padding']],
    [
      ['px', ['padding-left', 'padding-right']],
      ['py', ['padding-top', 'padding-bottom']],
    ],
    [
      ['pt', ['padding-top']],
      ['pr', ['padding-right']],
      ['pb', ['padding-bottom']],
      ['pl', ['padding-left']],
    ],
    [
      ['pis', ['padding-inline-start']],
      ['pie', ['padding-inline-end']],
    ],
  ])
}
