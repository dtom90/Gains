<template>
  <f7-block
    class="exercise-block"
    :style="{backgroundColor: completed ? '#27AE60' : '#D7263D'}"
  >
    <!-- Status & Exercise -->
    <p
      class="exercise-target text-shadow"
      style="margin-bottom: 12px;"
    >
      {{ adjective }}:
    </p>
    <p class="exercise-name text-shadow">
      {{ exercise.name }}
    </p>

    <!-- Weight & Reps Target -->
    <div
      v-if="!completed"
      class="exercise-target text-shadow"
      style="margin-bottom: 36px;"
    >
      <div>
        <span>{{ exercise.weight }} lbs.</span>
      </div>
      <div>
        <span>{{ exercise.reps }} rep{{ exercise.reps > 1 ? 's' : '' }}</span>
      </div>
    </div>

    <!-- Weight & Reps Inputs -->
    <f7-block
      v-if="completed"
      class="input-block display-flex justify-content-center"
    >
      <f7-list
        class="input-list"
        no-hairlines-md
      >
        <f7-list-input
          id="weight-picker"
          class="input-item color-white"
          inline-label
          label="Weight"
          type="number"
          readonly
          error-message="Only positive numbers please!"
          validate
          min="0"
          pattern="[0-9]*"
          @change="weight = parseInt($event.target.value)"
        >
          <div
            slot="inner"
            class="item-label"
          >
            &nbsp;lbs.
          </div>
        </f7-list-input>
        <f7-list-input
          id="rep-picker"
          class="input-item color-white"
          inline-label
          label="Reps"
          type="number"
          readonly
          error-message="Only positive numbers please!"
          validate
          min="1"
          pattern="[0-9]*"
          @change="reps = parseInt($event.target.value)"
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
        <div
          id="set-update-alert"
          class="input-info text-align-center"
        >
          &nbsp;{{ updated ? 'Set numbers updated!' : '' }}&nbsp;
        </div>
      </f7-list>
    </f7-block>

    <!-- Done Button -->
    <f7-button
      v-if="!rest"
      class="done-button"
      large
      strong
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

const maxWeight = 300
const step1 = '+/- 1'
const step5 = '+/- 5'
const weightOptions = {
  [step5]: [...Array(maxWeight / 5 + 1).keys()].map(x => x * 5),
  [step1]: [...Array(maxWeight).keys()]
}

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
    reps: null,
    updated: false
  }),
  computed: {
    adjective () { return this.rest ? (this.completed ? 'Completed' : 'Next') : 'Now' }
  },
  watch: {
    exercise: function (newExercise) {
      this.weight = newExercise.weight
      this.reps = newExercise.reps
      this.updated = false
    },
    completed: function (completed) {
      if (completed) {
        const self = this
        const app = self.$f7
        this.$nextTick(() => {
          self.weightPicker = app.picker.create({
            inputEl: '#weight-picker input',
            formatValue: function (values) {
              return values[1]
            },
            cols: [
              {
                textAlign: 'left',
                values: Object.keys(weightOptions),
                onChange: function (picker, step) {
                  let currentValue = parseInt(picker.value[1])
                  if (step === step5 && currentValue % 5 !== 0) {
                    currentValue = Math.round(currentValue / 5) * 5
                  }
                  if (picker.cols[1].replaceValues) {
                    picker.cols[1].replaceValues(weightOptions[step])
                    picker.cols[1].setValue(currentValue, 0)
                  }
                }
              },
              {
                values: Object.values(weightOptions)[0],
                width: 160
              }
            ],
            value: [this.weight % 5 === 0 ? step5 : step1, this.weight]
          })
          self.repPicker = app.picker.create({
            inputEl: '#rep-picker input',
            cols: [
              {
                textAlign: 'center',
                values: [...Array(50).keys()].map(x => x + 1)
              }
            ],
            value: [this.reps]
          })
        })
      } else if (this.weightPicker || this.repPicker) {
        this.weightPicker.destroy()
        this.repPicker.destroy()
      }
    }
  },
  mounted () {
    if (this.exercise) {
      this.weight = this.exercise.weight
      this.reps = this.exercise.reps
    }
    this.updated = false
  },
  methods: {

    ...mapMutations(['addCompletedSet']),

    enterSet () {
      console.log({
        workoutId: this.workoutId,
        workoutTime: this.workoutTime,
        time: this.lastCompletedExerciseTime,
        weight: this.weight,
        reps: this.reps
      })
      this.addCompletedSet({
        workoutId: this.workoutId,
        workoutTime: this.workoutTime,
        time: this.lastCompletedExerciseTime,
        weight: this.weight,
        reps: this.reps
      })
      this.updated = true
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
  .text-shadow {
    text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }
  .exercise-name {
    margin: 0;
    font-size: 48px;
    font-weight: bold;
    text-align: center;
  }
  .exercise-target {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
  }
  .done-button {
    background-color: #27AE60;
    height: auto;
    font-weight: bold;
    font-size: 32px;
    max-width: 242px;
    padding: 12px;
    margin: 12px auto 12px auto;
  }
  .input-block {
    margin: 0;
    background-color: #27AE60;
  }
  .input-list {
    margin: 0;
    max-width: 200px;
  }
  .input-item {
    background-color: #2ABF68;
  }
  #set-update-alert {
    position: static;
    margin-top: 10px;
    color: white;
  }
</style>

<style>
  .input-list input {
    background-color: #2ABF68 !important;
  }
</style>
