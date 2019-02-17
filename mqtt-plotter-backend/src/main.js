// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueMqtt from 'vue-mqtt'

Vue.use(VueMqtt, 'ws://iain.in:9001/ws', { clientId: 'WebClient-' + parseInt(Math.random() * 100000), username: 'iain', password: 'iain' })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
