import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'resize-none': { resize: 'none' },
    'resize-y': { resize: 'vertical' },
    'resize-x': { resize: 'horizontal' },
    resize: { resize: 'both' },
  })
}
