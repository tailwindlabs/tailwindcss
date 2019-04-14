import _ from 'lodash'

export default {
  props: ['text'],
  render(h) {
    let text = this.text

    if (_.isString(text)) {
      text = [text]
    }

    const characters = _(text).map(chunk => {
      return _.isString(chunk)
        ? { text: chunk, class: '' }
        : chunk
    }).flatMap(chunk => {
      return chunk.text.split('').map(c => {
        return h('div', { class: `hidden whitespace-pre ${chunk.class}`}, [c])
      })
    }).value()

    return h('div', { class: 'inline-block code-green' }, characters)
  }
}
