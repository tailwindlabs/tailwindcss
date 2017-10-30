const anchorJS = require('anchor-js')
const Prism = require('prismjs')

window.anchors = new anchorJS()
window.Vue = require('vue')

Vue.component('responsive-code-sample', require('./components/ResponsiveCodeSample.vue'))

const app = new Vue({
    el: '#app'
})

Prism.highlightAll()
anchors.options = { placement: 'left', class: 'text-slate-light' };
anchors.add();
