<template>
  <f7-panel
    left
    reveal
    resizable
  >
    <f7-view>
      <f7-page>
        <f7-block-title>Data</f7-block-title>
        <f7-block>
          <br>
          <f7-button
            fill
            large
            @click="loadState"
          >
            <span>{{ localContents ? 'Clear' : 'View Local Data' }}</span>
          </f7-button>
          <div v-if="localContents">
            <p>
              <strong>Local Data:</strong>
            </p>
            <textarea
              ref="localContents"
              v-model="localContents"
              readonly="readonly"
              :rows="Math.min(localContents.split('\n').length, 20)"
              style="width: 100%; white-space: pre; overflow: auto;"
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
          <div v-if="canStore">
            <f7-button
              v-if="localContents"
              fill
              large
              @click="saveData"
            >
              <span>Save Data to iCloud</span>
            </f7-button>
            <br>
            <f7-button
              fill
              large
              @click="readData"
            >
              <span>{{ iCloudContents ? 'Clear' : 'View iCloud Data' }}</span>
            </f7-button>
            <p v-if="iCloudContents">
              <strong>iCloud Data:</strong>
            </p>
            <textarea
              ref="iCloudContents"
              v-model="iCloudContents"
              readonly="readonly"
              :rows="Math.min(iCloudContents.split('\n').length, 20)"
              style="width: 100%; white-space: pre; overflow: auto;"
            />
            <br>
            <f7-button
              v-if="iCloudContents"
              fill
              large
              @click="copyToClipboard('iCloudContents')"
            >
              <span>Copy to Clipboard</span>
            </f7-button>
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
    canStore: false,
    localContents: '',
    iCloudContents: ''
  }),
  mounted () {
    this.$f7ready(f7 => {
      this.canStore = this.$f7.device.cordova
    })
  },
  methods: {
    loadState () {
      if (!this.localContents) {
        this.localContents = JSON.stringify(this.$store.state, null, 2)
      } else {
        this.localContents = ''
      }
    },
    saveData () {
      fileStorage.saveData(this.$store.state,
        message => { this.$f7.dialog.alert(message, 'Save Data to iCloud') },
        errMessage => { this.$f7.dialog.alert(errMessage, 'Error') }
      )
    },
    readData () {
      if (!this.iCloudContents) {
        fileStorage.readData(content => {
          this.iCloudContents = JSON.stringify(JSON.parse(content), null, 2)
        },
        errMessage => { this.$f7.dialog.alert(errMessage, 'Error') })
      } else {
        this.iCloudContents = ''
      }
    },
    copyToClipboard (refId) {
      /* Get the text field */
      var copyText = this.$refs[refId]

      /* Select the text field */
      copyText.select()
      copyText.setSelectionRange(0, 99999) /* For mobile devices */

      /* Copy the text inside the text field */
      document.execCommand('copy')

      /* Alert the copied text */
      this.$f7.dialog.alert(
        `Data from ${refId === 'localContents' ? 'Local Storage' : 'iCloud'} has been copied to the clipboard`,
        'Copied data'
      )
    }
  }
}
</script>

<style scoped>

</style>
