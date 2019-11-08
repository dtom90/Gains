<template>
  <!-- App -->
  <f7-app
    :params="f7params"
    theme-dark
  >
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
// Import Routes
import routes from './routes.js'

export default {
  components: { f7App, f7View },
  data () {
    return {
      // Framework7 parameters here
      f7params: {
        id: 'io.framework7.testapp', // App bundle ID
        name: 'Framework7', // App name
        theme: 'auto', // Automatic theme detection
        // App routes
        routes: routes
      }
    }
  }
}
</script>
