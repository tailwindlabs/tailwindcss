window.Vue = require('vue')
Vue.component('workflow-animation', require('./components/WorkflowAnimation.vue'))

const app = new Vue({
  el: '#app'
})
