<template>
  <f7-block class="exercise-block" :style="{backgroundColor: completed ? 'green' : 'blue'}">
    <p :class="(rest ? '' : 'large-text')+' text-align-center'">
      {{ adjective }}{{ dispExercise }}: {{ this.exercise }}
    </p>
    <f7-input
      v-if="completed"
      placeholder="Reps"
      type="number"
      :value="reps"
      @input="reps = parseInt($event.target.value)"
      @keypress.native.enter="enterReps(exercise, reps)"
      error-message="Only positive numbers please!"
      validate
      min="1"
      pattern="[0-9]*"
    >
    </f7-input>
    <f7-button v-if="!rest" class="col" big fill raised @click="finishInterval">
      Done
    </f7-button>
  </f7-block>
</template>

<script>
  export default {
    name: "ExercisePanel",
    props: {
      exercise: String,
      rest: Boolean,
      completed: {
        type: Boolean,
        default: false
      },
      finishInterval: Function,
      enterReps: Function,
    },
    computed: {
      adjective() { return this.rest ? (this.completed ? 'Completed' : 'Next') : 'Current' },
      dispExercise() { return this.completed ? '' : ' Exercise' }
    },
    data: () => ({
      reps: null
    }),
  }
</script>

<style scoped>
  .exercise-block {
    border-radius: 5px;
    padding: 16px;
    font-size: 18px;
  }
</style>
