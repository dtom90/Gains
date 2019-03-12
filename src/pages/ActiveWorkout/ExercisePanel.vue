<template>
  <f7-block>
    <p :class="(rest ? '' : 'large-text')+' text-align-center'">
      {{ rest ? 'Next' : 'Current' }} Exercise: {{ this.currentExercise }}
    </p>
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
