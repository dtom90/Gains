<template>
  <f7-block class="rest-block">
    <p
      v-if="!rest"
      class="text-align-center"
    >
      Next Up: {{ restTime }}s Rest
    </p>
    <p
      v-if="rest"
      class="large-text text-align-center"
    >
      Rest: {{ countdown }}
    </p>
    <f7-button
      v-if="rest"
      class="col"
      big
      fill
      raised
      color="red"
      @click="finishRest"
    >
      Skip Rest
    </f7-button>
  </f7-block>
</template>

<script>
import { f7Block, f7Button } from 'framework7-vue'

export default {

  name: 'RestPanel',
  components: { f7Block, f7Button },

  props: {
    countdown: {
      type: Number,
      default: 30
    },
    restTime: {
      type: Number,
      default: 30
    },
    rest: Boolean,
    finishRest: {
      type: Function,
      default: () => console.error('Rest completion method not passed in')
    }
  }
}
</script>

<style scoped>
    .rest-block {
        background-color: darkred;
        border-radius: 5px;
        padding: 16px;
    }
</style>
