import defineClasses from '../util/defineClasses'

export default function({ naming: { verticalAlign: ns } }) {
  return defineClasses({
    [ns.alignBaseline]: { 'vertical-align': 'baseline' },
    [ns.alignTop]: { 'vertical-align': 'top' },
    [ns.alignMiddle]: { 'vertical-align': 'middle' },
    [ns.alignBottom]: { 'vertical-align': 'bottom' },
    [ns.alignTextTop]: { 'vertical-align': 'text-top' },
    [ns.alignTextBottom]: { 'vertical-align': 'text-bottom' },
  })
}
