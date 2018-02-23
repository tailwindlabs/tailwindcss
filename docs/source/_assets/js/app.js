const anchorJS = require('anchor-js')
const Prism = require('./prism')
const Mousetrap = require('mousetrap')

window.anchors = new anchorJS()
window.Vue = require('vue')

Vue.component('responsive-code-sample', require('./components/ResponsiveCodeSample.vue'))
Vue.component('v-component', require('./components/MetaComponent.vue'))
Vue.component('class-table', require('./components/ClassTable.vue'))

const app = new Vue({
  el: '#app'
})

Prism.highlightAll()
anchors.options = { placement: 'left', class: 'text-grey-dark' }
anchors.add()

// Add shortcut to search input when pressing the "/" key
Mousetrap.bind('/', function (e) {
  e.preventDefault()
  document.getElementById('docsearch').focus()
})
