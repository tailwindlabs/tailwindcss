<template>
  <ul class="list-reset" v-if="links.length > 0">
    <li class="mb-2" :class="link.isChild ? 'ml-2' : ''" v-for="link in links">
      <a :href="link.href" class="text-grey-dark hover:text-grey-darkest">{{ link.text }}</a>
    </li>
  </ul>
</template>

<script>
import _ from 'lodash'
const anchorJS = require('anchor-js')
const anchors = new anchorJS()

function getHeadingText(element) {
  let text = ''
  for (var i = 0; i < element.childNodes.length; ++i) {
    if (element.childNodes[i].nodeType === 3) {
      text += element.childNodes[i].textContent;
    }
  }
  return text
}

export default {
  props: ['rows'],
  data() {
    return {
      links: []
    }
  },
  methods: {
    scrollTo(el) {
      const bounds = el.getBoundingClientRect()
      document.body.scrollBy(0, 200)
    }
  },
  mounted() {
    anchors.options = { placement: 'left', class: 'text-grey-dark' }
    anchors.add()
    this.links = anchors.elements.filter((el) => _.includes(['H2', 'H3'], el.tagName)).map((el) => {
      return {
        isChild: el.tagName === 'H3',
        text: getHeadingText(el),
        href: el.querySelector('.anchorjs-link').getAttribute('href'),
        el: el,
      }
    })
  }
}
</script>
