import defineClasses from '../util/defineClasses'

export default function({ naming: { backgroundAttachment: ns } }) {
  return defineClasses({
    [ns.fixed]: { 'background-attachment': 'fixed' },
    [ns.local]: { 'background-attachment': 'local' },
    [ns.scroll]: { 'background-attachment': 'scroll' },
  })
}
