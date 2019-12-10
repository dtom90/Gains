// Import Vue & Vuex store
import Vue from 'vue'
import store from '../store'

// Import Framework7
import Framework7 from 'framework7'

// Import Framework7-Vue Plugin
import Framework7Vue from 'framework7-vue'

// Import additional Framework7 components
import Picker from 'framework7/components/picker/picker'
import Sheet from 'framework7/components/sheet/sheet'
import Dialog from 'framework7/components/dialog/dialog'
import Panel from 'framework7/components/panel/panel'

// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css'

// Import Icons and App Custom Styles
import '../css/icons.css'
import '../css/app.scss'

// Import App Component
import App from '../components/app.vue'

// Init Framework7-Vue Plugin and additional components
Framework7.use([Framework7Vue, Dialog, Picker, Sheet, Panel])

// Init App
new Vue({ // eslint-disable-line no-new
  el: '#app',
  components: { App },
  template: '<App/>',
  store // Use Vuex store
})
