const anchorJS = require('anchor-js')
const Prism = require('./prism')

window.anchors = new anchorJS()
window.Vue = require('vue')

Vue.component('responsive-code-sample', require('./components/ResponsiveCodeSample.vue'))

const app = new Vue({
    el: '#app'
})

Prism.highlightAll()
anchors.options = { placement: 'left', class: 'text-slate-light' };
anchors.add();

document.onkeyup = function (e) {
    if (e.which == 191) {
        document.getElementById('docsearch').focus();
    }
};