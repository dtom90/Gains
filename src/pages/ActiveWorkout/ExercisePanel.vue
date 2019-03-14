<template>
  <f7-block class="exercise-block">
    <p :class="(rest ? '' : 'large-text')+' text-align-center'">
      {{ rest ? 'Next' : 'Current' }} Exercise: {{ this.currentExercise }}
    </p>
    <f7-button v-if="!rest" class="col" big fill raised @click="finishInterval">
      Done
    </f7-button>
  </f7-block>
</template>

<script>
  export default {
    name: "ExercisePanel",
    props: {
      currentExercise: String,
      rest: Boolean,
      finishInterval: Function,
    }
  }
</script>

<style scoped>
  .exercise-block {
    background-color: blue;
    border-radius: 5px;
    padding: 16px;
  }
</style>
