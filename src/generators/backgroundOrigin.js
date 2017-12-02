import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'bg-o-padding': { 'background-origin': 'padding-box' },
    'bg-o-border': { 'background-origin': 'border-box' },
    'bg-o-content': { 'background-origin': 'content-box' },
  })
}
