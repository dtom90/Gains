<template>
  <f7-block class="rest-block">
    <p v-if="!rest" class="text-align-center">Next Up: {{restTime}}s Rest</p>
    <p v-if="rest" class="large-text text-align-center">Rest: {{ countdown }}</p>
    <f7-button v-if="rest" class="col" big fill raised color="red" @click="finishInterval">
      Skip Rest
    </f7-button>
  </f7-block>
</template>

<script>
  export default {
    name: "RestPanel",
    props: {
      countdown: Number,
      restTime: Number,
      rest: Boolean,
      finishInterval: Function,
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
