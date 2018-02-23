const Prism = require('./prism')
const Mousetrap = require('mousetrap')

window.Vue = require('vue')

Vue.component('responsive-code-sample', require('./components/ResponsiveCodeSample.vue'))
Vue.component('v-component', require('./components/MetaComponent.vue'))
Vue.component('class-table', require('./components/ClassTable.vue'))
Vue.component('table-of-contents', require('./components/TableOfContents.vue'))

const app = new Vue({
  el: '#app'
})

Prism.highlightAll()

// Add shortcut to search input when pressing the "/" key
Mousetrap.bind('/', function (e) {
  e.preventDefault()
  document.getElementById('docsearch').focus()
})
