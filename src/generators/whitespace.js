import defineClasses from '../util/defineClasses'

export default function({ naming: { textWrap: ns } }) {
  return defineClasses({
    [ns.whitespaceNormal]: { 'white-space': 'normal' },
    [ns.whitespaceNoWrap]: { 'white-space': 'nowrap' },
    [ns.whitespacePre]: { 'white-space': 'pre' },
    [ns.whitespacePreLine]: { 'white-space': 'pre-line' },
    [ns.whitespacePreWrap]: { 'white-space': 'pre-wrap' },

    [ns.breakWords]: { 'word-wrap': 'break-word' },
    [ns.breakNormal]: { 'word-wrap': 'normal' },

    [ns.truncate]: {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
  })
}
