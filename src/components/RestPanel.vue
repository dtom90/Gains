<template>
  <f7-block class="rest-block">
    <p
      v-if="!rest"
      class="text-align-center"
    >
      Next Up: {{ restTime }}s Rest
    </p>
    <p
      v-if="rest && countdown > 0"
      class="large-text text-align-center"
    >
      Rest: {{ countdown }}
    </p>
    <f7-button
      v-if="rest"
      class="col big-button"
      big
      fill
      raised
      :color="countdown > 0 ? 'red' : 'blue'"
      @click="finishRest"
    >
      {{ countdown > 0 ? 'Skip Rest' : 'Next Set' }}
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
      default: () => {}
    }
  }
}
</script>

<style scoped>
    .rest-block {
        background-color: darkred;
        border-radius: 5px;
        padding: 16px;
        margin-top: 28px;
        margin-bottom: 28px;
    }
</style>
