const Prism = require('./prism')
const Mousetrap = require('mousetrap')

window.Vue = require('vue')

Vue.component('responsive-code-sample', require('./components/ResponsiveCodeSample.vue').default)
Vue.component('table-of-contents', require('./components/TableOfContents.vue').default)
Vue.component('workflow-animation', require('./components/WorkflowAnimation.vue').default)


const app = new Vue({
  el: '#app'
})

Prism.highlightAll()

// Add shortcut to search input when pressing the "/" key
Mousetrap.bind('/', function (e) {
  e.preventDefault()
  document.getElementById('docsearch').focus()
})

;(function () {
  var s = document.createElement('script')
  s.setAttribute('async', '')
  s.src = '//cdn.carbonads.com/carbon.js?serve=CK7DTK3E&placement=tailwindcsscom'
  s.id = '_carbonads_js'
  var adElement = document.getElementById('ad')
  adElement.innerHTML = ''
  adElement.appendChild(s)
})()
