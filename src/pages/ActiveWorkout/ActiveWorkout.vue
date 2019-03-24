<template>
  <f7-page>
    <f7-navbar
      :title="'Active Workout: '+workout.name"
      back-link="Back"
    />

    <f7-block
      v-if="!done"
      strong
    >
      <p>{{ firstExerciseOfRound && rest ? 'Next' : 'Current' }} Round: {{ currentRound }}</p>

      <rest-panel
        v-if="rest"
        :countdown="countdown"
        :rest="rest"
        :finish-interval="finishInterval"
      />

      <exercise-panel
        v-if="rest && !firstExerciseOfWorkout"
        :exercise="previousExercise"
        :rest="rest"
        :completed="true"
        :enter-reps="enterReps"
      />

      <exercise-panel
        :exercise="currentExercise"
        :rest="rest"
        :finish-interval="finishInterval"
      />

      <rest-panel
        v-if="!rest"
        :countdown="countdown"
        :rest="rest"
        :rest-time="restTime"
      />
    </f7-block>

    <f7-block v-if="done">
      <h1>DONE!!!</h1>

      <p><strong>Total Workout Time:</strong> {{ totalWorkoutTime }}</p>
    </f7-block>
  </f7-page>
</template>

<script>
import { f7Page, f7Navbar, f7Block } from 'framework7-vue'
import { mapMutations } from 'vuex'
import ExercisePanel from './ExercisePanel.vue'
import RestPanel from './RestPanel.vue'

const interval = 30

export default {

  components: {
    'exercise-panel': ExercisePanel,
    'rest-panel': RestPanel,
    f7Page,
    f7Navbar,
    f7Block
  },

  data: () => ({
    workout: {},
    startTime: null,
    endTime: null,
    currentExerciseIndex: 0,
    currentRound: 1,
    lastCompletedExerciseTime: null,
    restTime: interval,
    countdown: interval,
    timer: null,
    started: false,
    rest: false,
    done: false
  }),

  computed: {
    previousExercise () { return this.workout.exercises[mod((this.currentExerciseIndex - 1), this.workout.exercises.length)] },
    currentExercise () { return this.workout.exercises[this.currentExerciseIndex] },
    firstExerciseOfRound () { return this.currentExerciseIndex === 0 },
    lastExerciseOfRound () { return this.currentExerciseIndex === this.workout.exercises.length - 1 },
    firstExerciseOfWorkout () { return this.currentRound === 0 && this.currentExerciseIndex === 0 },
    lastRound () { return this.currentRound === this.workout.rounds },
    completed () { return this.$store.state.completed },
    totalWorkoutTime () { return toHumanTime(this.endTime - this.startTime) }
  },

  created: function () {
    this.workout = this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
    this.startTime = Date.now()
  },

  methods: {

    ...mapMutations(['addCompletedExercise', 'addCompletedReps']),

    finishInterval () {
      if (!this.rest) {
        this.lastCompletedExerciseTime = Date.now()
        this.addCompletedExercise({
          exercise: this.currentExercise,
          completedTime: this.lastCompletedExerciseTime
        })

        this.rest = true
        this.countdown = interval
        this.timer = setInterval(this.decrementCountdown, 1000)

        if (this.lastExerciseOfRound && this.lastRound) {
          this.done = true
          this.endTime = Date.now()
        } else {
          this.currentExerciseIndex = (this.currentExerciseIndex + 1) % this.workout.exercises.length
          if (this.currentExerciseIndex === 0) { this.currentRound += 1 }
        }
      } else {
        this.finishRest()
      }
    },

    enterReps (exercise, reps) {
      if (this.$store.state.completed[this.lastCompletedExerciseTime].exercise === exercise) { this.addCompletedReps({ time: this.lastCompletedExerciseTime, reps }) }
    },

    decrementCountdown () {
      if (this.countdown > 1) {
        this.countdown -= 1
      } else {
        this.finishRest()
      }
    },

    finishRest () {
      this.countdown = 0
      this.rest = false
      clearInterval(this.timer)
    }

  }
}

function mod (a, b) {
  return ((a % b) + b) % b
}

function toHumanTime (ms) {
  let secNum = Math.floor(ms / 1000)
  let hours = Math.floor(secNum / 3600)
  let minutes = Math.floor((secNum - (hours * 3600)) / 60)
  let seconds = secNum - (hours * 3600) - (minutes * 60)

  if (hours > 0) { hours = hours + ' hours' }
  if (minutes > 0) { minutes = minutes + ' minutes' }
  if (seconds > 0) { seconds = seconds + ' seconds' }
  return hours + minutes + seconds
}
</script>
