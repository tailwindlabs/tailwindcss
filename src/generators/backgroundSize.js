import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'bg-auto': {
      'background-size': 'auto',
    },
    'bg-cover': {
      'background-size': 'cover',
    },
    'bg-contain': {
      'background-size': 'contain',
    },
  })
}
