<template>
  <f7-panel
    left
    reveal
    resizable
  >
    <f7-view>
      <f7-page>
        <f7-block-title>Data</f7-block-title>
        <f7-block strong>
          <f7-button
            :disabled="iCloudContents.length > 0"
            fill
            large
            @click="loadState"
          >
            <span>{{ localContents ? 'Hide' : 'View' }} Local Data</span>
          </f7-button>
          <div v-if="localContents">
            <br>
            <textarea
              ref="localContents"
              v-model="localContents"
              readonly="readonly"
              style="width: 100%; height: 300px; white-space: pre; overflow: auto;"
            />
            <br>
            <f7-button
              fill
              large
              @click="copyToClipboard('localContents')"
            >
              <span>Copy to Clipboard</span>
            </f7-button>
          </div>
          <br>
          <div v-if="isIos">
            <f7-button
              v-if="localContents"
              fill
              large
              @click="saveData"
            >
              <span>Save Data to iCloud</span>
            </f7-button>
            <div v-if="!localContents">
              <f7-button
                fill
                large
                @click="readData"
              >
                <span>{{ iCloudContents ? 'Hide' : 'View' }} iCloud Data</span>
              </f7-button>
              <div v-if="iCloudContents">
                <br>
                <textarea
                  ref="iCloudContents"
                  v-model="iCloudContents"
                  readonly="readonly"
                  style="width: 100%; height: 300px; white-space: pre; overflow: auto;"
                />
                <br>
                <f7-button
                  fill
                  large
                  @click="copyToClipboard('iCloudContents')"
                >
                  <span>Copy to Clipboard</span>
                </f7-button>
              </div>
            </div>
          </div>
        </f7-block>
      </f7-page>
    </f7-view>
  </f7-panel>
</template>

<script>
import fileStorage from '../lib/fileStorage'
import { f7Panel, f7View, f7Page, f7Block, f7BlockTitle, f7Button } from 'framework7-vue'

export default {
  name: 'SidePanel',
  components: { f7Panel, f7View, f7Page, f7Block, f7BlockTitle, f7Button },
  data: () => ({
    localContents: '',
    iCloudContents: ''
  }),
  computed: {
    isIos () { return this.$device.ios }
  },
  methods: {
    errorCallback (errMessage) { this.$f7.dialog.alert(errMessage, 'Error') },
    loadState () {
      if (!this.localContents) {
        this.localContents = JSON.stringify(this.$store.state, null, 2)
      } else {
        this.localContents = ''
      }
    },
    saveData () {
      fileStorage.saveData(JSON.stringify(this.$store.state),
        message => { this.$f7.dialog.alert(message, 'Save Data to iCloud') },
        this.errorCallback
      )
    },
    readData () {
      if (!this.iCloudContents) {
        fileStorage.readData(content => {
          this.iCloudContents = JSON.stringify(JSON.parse(content), null, 2)
        },
        this.errorCallback)
      } else {
        this.iCloudContents = ''
      }
    },
    copyToClipboard (refId) {
      const textElement = this.$refs[refId]

      const successCallback = () => {
        this.$f7.dialog.alert(
          `Data from ${refId === 'localContents' ? 'Local Storage' : 'iCloud'} has been copied to the clipboard`,
          'Copied data'
        )
      }

      if (this.$device.cordova) {
        cordova.plugins.clipboard.copy(textElement.value, successCallback, this.errorCallback) // eslint-disable-line no-undef
      } else {
        /* Select the text field */
        textElement.select()
        textElement.setSelectionRange(0, 99999) /* For mobile devices */

        /* Copy the text inside the text field */
        document.execCommand('copy')

        successCallback()
      }
    }
  }
}
</script>

<style scoped>

</style>
