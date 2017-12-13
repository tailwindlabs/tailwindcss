const anchorJS = require('anchor-js')
const Prism = require('./prism')
const PrismToolbar = require('./prism-plugins/prism-toolbar')
const clipboard = require('./clipboard')
const PrismClipboard = require('./prism-plugins/prism-clipboard')
const Mousetrap = require('mousetrap')

window.anchors = new anchorJS()
window.Vue = require('vue')

Vue.component('responsive-code-sample', require('./components/ResponsiveCodeSample.vue'))

const app = new Vue({
  el: '#app'
})

Prism.highlightAll()
anchors.options = { placement: 'left', class: 'text-slate-light' }
anchors.add()

// Add shortcut to search input when pressing the "/" key
Mousetrap.bind('/', function (e) {
  e.preventDefault()
  document.getElementById('docsearch').focus()
})
