<template>
  <f7-block>
    <p v-if="!rest" class="text-align-center">Next Up: Rest</p>
    <p v-if="rest" class="large-text text-align-center">Rest: {{ countdown }}</p>
    <f7-button v-if="rest" class="col" big fill raised color="yellow" @click="finishInterval">
      Skip Rest
    </f7-button>
  </f7-block>
</template>

<script>
  export default {
    name: "RestPanel",
    props: {
      countdown: Number,
      rest: Boolean,
      finishInterval: Function,
    }
  }
</script>

<style scoped>

</style>
