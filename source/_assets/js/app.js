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

// ;(function () {
//   var s = document.createElement('script')
//   s.setAttribute('async', '')
//   s.src = '//cdn.carbonads.com/carbon.js?zoneid=1673&serve=C6AILKT&placement=tailwindcsscom'
//   s.id = '_carbonads_js'
//   var adElement = document.getElementById('ad')
//   adElement.innerHTML = ''
//   adElement.appendChild(s)
// })()
