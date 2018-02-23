<template>
    <ul class="list-reset">
      <li class="mb-3" v-for="link in links">
        <a :href="link.href" class="text-grey-dark hover:text-grey-darkest">{{ link.text }}</a>
      </li>
    </ul>
</template>

<script>
const anchorJS = require('anchor-js')
const anchors = new anchorJS()

export default {
  props: ['rows'],
  data() {
    return {
        links: []
    }
  },
  mounted() {
    anchors.options = { placement: 'left', class: 'text-grey-dark' }
    anchors.add()
    this.links = anchors.elements.map((el) => {
        return {
            text: el.textContent,
            href: el.querySelector('.anchorjs-link').getAttribute('href'),
        }
    })
  }
}
</script>
