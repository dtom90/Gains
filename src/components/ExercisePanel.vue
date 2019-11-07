<template>
  <f7-block
    class="exercise-block"
    :style="{backgroundColor: completed ? 'green' : 'blue'}"
  >
    <p :class="(rest ? '' : 'large-text')+' text-align-center'">
      {{ adjective }} Exercise: {{ exercise.name }}
    </p>
    <p class="text-align-center">
      Target: {{ exercise.reps }} rep{{ exercise.reps > 1 ? 's' : '' }} of {{ exercise.weight }} lbs.
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
          label="Weight"
          type="number"
          :value="weight"
          error-message="Only positive numbers please!"
          validate
          min="0"
          pattern="[0-9]*"
          @input="weight = parseInt($event.target.value)"
        >
          <div
            slot="inner"
            class="item-label"
          >
            &nbsp;lbs.
          </div>
        </f7-list-input>
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
        />
        <f7-button
          big
          fill
          raised
          color="green"
          @click="enterSet"
        >
          Submit
        </f7-button>
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
      type: Object,
      default: () => null
    },
    rest: Boolean,
    completed: {
      type: Boolean,
      default: false
    },
    workoutId: {
      type: String,
      default: 'Workout'
    },
    workoutTime: {
      type: Number,
      default: 0
    },
    startTime: {
      type: Number,
      default: 0
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
  watch: {
    exercise: function (newExercise) {
      this.weight = newExercise.weight
      this.reps = newExercise.reps
    }
  },
  mounted () {
    if (this.exercise) {
      this.weight = this.exercise.weight
      this.reps = this.exercise.reps
    }
  },
  methods: {

    ...mapMutations(['addCompletedSet']),

    enterSet () {
      this.addCompletedSet({
        workoutId: this.workoutId,
        workoutTime: this.workoutTime,
        time: this.lastCompletedExerciseTime,
        weight: this.weight,
        reps: this.reps
      })
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
