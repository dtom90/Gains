<template>
  <f7-block
    class="exercise-block"
    :style="{backgroundColor: completed ? 'green' : 'blue'}"
  >
    <p :class="(rest ? '' : 'large-text')+' text-align-center'">
      {{ adjective }} Exercise: {{ exercise }}
    </p>
    <f7-block
      v-if="completed"
      class="input-block display-flex justify-content-center"
    >
      <f7-list
        class="input-list"
        no-hairlines-md
      >
        <f7-list-input
          class="input-item color-white"
          inline-label
          label="Reps"
          type="number"
          :value="reps"
          error-message="Only positive numbers please!"
          validate
          min="1"
          pattern="[0-9]*"
          @input="reps = parseInt($event.target.value)"
          @keypress.native.enter="enterReps(exercise, reps)"
        />
      </f7-list>
    </f7-block>
    <f7-button
      v-if="!rest"
      class="col"
      big
      fill
      raised
      @click="finishExercise"
    >
      Done
    </f7-button>
  </f7-block>
</template>

<script>
import { f7Block, f7List, f7ListInput, f7Button } from 'framework7-vue'
import { mapMutations } from 'vuex'

export default {

  name: 'ExercisePanel',
  components: { f7Block, f7List, f7ListInput, f7Button },
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
    lastCompletedExerciseTime: {
      type: Number,
      default: 0
    },
    finishExercise: {
      type: Function,
      default: () => null
    }
  },
  data: () => ({
    reps: null
  }),
  computed: {
    adjective () { return this.rest ? (this.completed ? 'Completed' : 'Next') : 'Current' }
  },
  methods: {

    ...mapMutations(['addCompletedReps']),

    enterReps (exercise, reps) {
      this.addCompletedReps({ time: this.lastCompletedExerciseTime, reps })
    }
  }
}
</script>

<style scoped>
  .exercise-block {
    border-radius: 5px;
    padding: 16px;
    font-size: 18px;
  }
  .input-block {
    margin: 0;
    background-color: green;
  }
  .input-list {
    margin: 0;
    max-width: 200px;
  }
  .input-item {
    background-color: #1B9A59;
  }
</style>
