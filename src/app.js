// Import Vue
import Vue from 'vue'

// Import store
import store from './store'

// Import F7
import Framework7 from 'framework7'

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue'

// Import F7 Styles
import 'framework7/css/framework7.bundle.min.css'

// Import Icons and App Custom Styles
import './css/icons.css'
import './css/app.css'

// Import App Component
import App from './App.vue'

// Init F7 Vue Plugin
Framework7.use(Framework7Vue)

// Init App
export default new Vue({
  el: '#app',

  // Register App Component
  components: {
    app: App
  },

  template: '<app/>',

  // Use Vuex store
  store
})
