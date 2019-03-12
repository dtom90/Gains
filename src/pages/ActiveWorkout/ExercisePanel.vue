<template>
  <f7-block>
    <h1>{{ rest ? 'Next' : 'Current' }} Round: {{ this.currentRound }}</h1>
    <h1>{{ rest ? 'Next' : 'Current' }} Exercise: {{ this.currentExercise }}</h1>
    <f7-button v-if="!rest" class="col" big fill raised @click="finishInterval">
      Complete
    </f7-button>
  </f7-block>
</template>

<script>
  export default {
    name: "ExercisePanel",
    props: {
      currentRound: Number,
      currentExercise: String,
      rest: Boolean,
      finishInterval: Function,
    }
  }
</script>

<style scoped>

</style>
