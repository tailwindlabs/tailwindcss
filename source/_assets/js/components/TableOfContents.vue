<template>
  <div>
    <h5 class="text-gray-500 uppercase tracking-wide font-bold text-sm lg:text-xs">On this page</h5>
    <ul class="mt-4 overflow-x-hidden" v-if="links.length > 0">
      <li class="mb-2" :class="link.isChild ? 'ml-2' : ''" v-for="link in links">
        <a :href="link.href" class="block transition-fast hover:translate-r-2px hover:text-gray-900 text-gray-600 font-medium">{{ link.text }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
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
    anchors.options = { placement: 'left', class: 'text-gray-500 no-underline', icon: '#' }
    anchors.add('#content h2, #content h3')
    this.links = anchors.elements.filter(el => {
      return !el.classList.contains('no-toc')
    }).map(el => {
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
