<template>
  <f7-block
    class="exercise-block"
    :style="{backgroundColor: completed ? 'green' : 'blue'}"
  >
    <p :class="(rest ? '' : 'large-text')+' text-align-center'">
      {{ adjective }}{{ dispExercise }}: {{ exercise }}
    </p>
    <f7-input
      v-if="completed"
      placeholder="Reps"
      type="number"
      :value="reps"
      error-message="Only positive numbers please!"
      validate
      min="1"
      pattern="[0-9]*"
      @input="reps = parseInt($event.target.value)"
      @keypress.native.enter="enterReps(exercise, reps)"
    />
    <f7-button
      v-if="!rest"
      class="col"
      big
      fill
      raised
      @click="finishInterval"
    >
      Done
    </f7-button>
  </f7-block>
</template>

<script>
import { f7Block, f7Input, f7Button } from 'framework7-vue'

export default {

  name: 'ExercisePanel',
  components: { f7Block, f7Input, f7Button },
  props: {
    exercise: {
      type: String,
      default: 'Exercise'
    },
    rest: Boolean,
    completed: {
      type: Boolean,
      default: false
    },
    finishInterval: Function,
    enterReps: Function
  },
  data: () => ({
    reps: null
  }),
  computed: {
    adjective () { return this.rest ? (this.completed ? 'Completed' : 'Next') : 'Current' },
    dispExercise () { return this.completed ? '' : ' Exercise' }
  }
}
</script>

<style scoped>
  .exercise-block {
    border-radius: 5px;
    padding: 16px;
    font-size: 18px;
  }
</style>
