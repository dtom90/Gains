<template>
  <!-- App -->
  <f7-app
    :params="f7params"
  >
    <!-- Side Panel -->
    <side-panel />

    <!-- Main View -->
    <f7-view
      id="main-view"
      url="/"
      main
    />
  </f7-app>
</template>

<script>
import { f7App, f7View } from 'framework7-vue'
import SidePanel from './components/SidePanel'
// Import Routes
import routes from './routes.js'

export default {
  components: { f7App, f7View, SidePanel },
  data () {
    return {
      // Framework7 parameters here
      f7params: {
        id: 'io.framework7.testapp', // App bundle ID
        name: 'Framework7', // App name
        theme: 'auto', // Automatic theme detection
        routes: routes // App routes
      }
    }
  }
}
</script>
