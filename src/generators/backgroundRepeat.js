import defineClasses from '../util/defineClasses'

export default function({ naming: { backgroundRepeat: ns } }) {
  return defineClasses({
    [ns.repeat]: { 'background-repeat': 'repeat' },
    [ns.noRepeat]: { 'background-repeat': 'no-repeat' },
    [ns.repeatX]: { 'background-repeat': 'repeat-x' },
    [ns.repeatY]: { 'background-repeat': 'repeat-y' },
  })
}
