import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'bg-cover': {
      backgroundSize: 'cover',
    },
    'bg-contain': {
      backgroundSize: 'contain',
    },
  })
}
