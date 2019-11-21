<template>
  <f7-navbar
    class="no-hairline no-shadow"
  >
    <f7-link
      id="close-button"
      :href="link"
      small
      round
    >
      <f7-icon material="close" />
    </f7-link>
  </f7-navbar>
</template>

<script>
import { f7Navbar, f7Link, f7Icon } from 'framework7-vue'
export default {
  name: 'CloseButton',
  components: { f7Navbar, f7Link, f7Icon },
  props: {
    link: {
      type: String,
      default: '/'
    }
  }
}
</script>

<style scoped>
    #close-button {
        color: rgb(0, 122, 255);
        font-size: 28px;
    }
</style>
