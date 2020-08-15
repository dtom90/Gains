<template>
  <!-- App -->
  <f7-app
    :params="f7params"
  >
    <!-- Side Panel -->
    <side-panel />

    <!-- Main View -->
    <f7-view
      main
      class="safe-areas"
      url="/"
    />
  </f7-app>
</template>

<script>
import cordovaApp from '../js/cordova-app.js'
import routes from '../js/routes.js'
import { f7App, f7View } from 'framework7-vue'
import SidePanel from '../components/SidePanel'

export default {
  components: { f7App, f7View, SidePanel },
  data () {
    return {
      // Framework7 Parameters
      f7params: {
        id: 'com.davidthomason.gainstrack', // App bundle ID
        name: 'GainsTrack', // App name
        theme: 'auto', // Automatic theme detection

        // App routes
        routes: routes,

        touch: {
          fastClicks: true // Enable fast clicks
        },

        // Cordova Statusbar settings
        statusbar: {
          iosOverlaysWebView: true,
          androidOverlaysWebView: false
        }
      }
    }
  },
  mounted () {
    this.$f7ready((f7) => {
      // Init cordova APIs (see cordova-app.js)
      if (f7.device.cordova) {
        cordovaApp.init(f7)
      }
      // Call F7 APIs here
    })
  }
}
</script>
