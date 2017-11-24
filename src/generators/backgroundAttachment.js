import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'bg-scroll': { 'background-attachment': 'scroll' },
    'bg-fixed': { 'background-attachment': 'fixed' },
    'bg-local': { 'background-attachment': 'local' },
    'bg-inherit': { 'background-attachment': 'inherit' },
    'bg-initial': { 'background-attachment': 'initial' },
    'bg-unset': { 'background-attachment': 'unset' },
  })
}
