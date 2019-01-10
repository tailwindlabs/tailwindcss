import lists from './generators/lists'
import appearance from './generators/appearance'
import backgroundAttachment from './generators/backgroundAttachment'
import backgroundColors from './generators/backgroundColors'

export default [
  { name: 'lists', generator: lists },
  { name: 'appearance', generator: appearance },
  { name: 'backgroundAttachment', generator: backgroundAttachment },
  { name: 'backgroundColors', generator: backgroundColors },
]
