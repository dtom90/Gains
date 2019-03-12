<template>
  <f7-block>
    <p v-if="!rest">Next Up: Rest</p>
    <h1 v-if="rest">Rest: {{ countdown }}</h1>
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
