const Prism = require('./prism')
const Mousetrap = require('mousetrap')

window.Vue = require('vue')

Vue.component('responsive-code-sample', require('./components/ResponsiveCodeSample.vue').default)
Vue.component('table-of-contents', require('./components/TableOfContents.vue').default)
Vue.component('video-player', require('./components/VideoPlayer.vue').default)

const app = new Vue({
  el: '#app',
})

Prism.highlightAll()

// Add shortcut to search input when pressing the "/" key
Mousetrap.bind('/', function(e) {
  e.preventDefault()
  document.getElementById('docsearch').focus()
})
// ;(function() {
//   if (Math.random() >= 0.5) {
//     document.getElementById('tailwind-ui-widget').removeAttribute('style')
//   } else {
//     document.getElementById('tailwind-ui-job-widget').removeAttribute('style')
//   }
// })()

// Re-enable sometime after Tailwind UI launch...
// fetch('//cdn.carbonads.com/carbon.js?serve=CK7DTK3E&placement=tailwindcsscom', {
//   method: 'HEAD',
//   mode: 'no-cors',
// })
//   .then(function() {
//     ;(function() {
//       var s = document.createElement('script')
//       s.setAttribute('async', '')
//       s.src = '//cdn.carbonads.com/carbon.js?serve=CK7DTK3E&placement=tailwindcsscom'
//       s.id = '_carbonads_js'
//       var adElement = document.getElementById('ad')
//       adElement.innerHTML = ''
//       adElement.appendChild(s)
//     })()
//   })
//   .catch(function() {
//     document.getElementById('refactoring-ui-widget').style.display = 'block'
//   })
