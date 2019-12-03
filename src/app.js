// Vue & Vuex store
import Vue from 'vue'
import store from './store'

// Framework7 core & additional components
import Framework7 from 'framework7'
import Picker from 'framework7/components/picker/picker'
import Sheet from 'framework7/components/sheet/sheet'
import Dialog from 'framework7/components/dialog/dialog'

// Framework7 Vue Plugin
import Framework7Vue from 'framework7-vue'

// Framework7 Styles
import 'framework7/css/framework7.bundle.min.css'

// Icons and App Custom Styles
import './css/icons.css'
import './css/app.css'

// App Component
import App from './App.vue'

// FastClick
import FastClick from 'fastclick'

// Default to passive events
import 'default-passive-events'

// install additional modules
Framework7.use([Framework7Vue, Dialog, Picker, Sheet])

// attach FastClick
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}

// Initialize App
export default new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  store // Use Vuex store
})
