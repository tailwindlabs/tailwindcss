import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'cursor-auto': { cursor: 'auto' },
    'cursor-default': { cursor: 'default' },
    'cursor-pointer': { cursor: 'pointer' },
    'cursor-wait': { cursor: 'wait' },
    'cursor-move': { cursor: 'move' },
    'cursor-not-allowed': { cursor: 'not-allowed' },
  })
}
