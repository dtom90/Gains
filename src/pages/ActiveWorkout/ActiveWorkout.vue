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
        :last-completed-exercise-time="lastCompletedExerciseTime"
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
    exerciseSequence: [],
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
    previousExercise () { return this.exerciseSequence[this.currentExerciseIndex - 1] },
    currentExercise () { return this.exerciseSequence[this.currentExerciseIndex] },
    firstExerciseOfWorkout () { return this.currentRound === 0 && this.currentExerciseIndex === 0 },
    firstExerciseOfRound () { return this.currentExerciseIndex % this.workout.exercises.length === 0 },
    lastExerciseOfWorkout () { return this.currentExerciseIndex === this.exerciseSequence.length - 1 },
    completed () { return this.$store.state.completed },
    totalWorkoutTime () { return toHumanTime(this.endTime - this.startTime) }
  },

  created: function () {
    this.workout = this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
    this.exerciseSequence = []
    for (let i = 0; i < this.workout.rounds; i++) {
      this.exerciseSequence.push(...this.workout.exercises)
    }
    this.startTime = Date.now()
  },

  methods: {

    ...mapMutations(['addCompletedExercise']),

    finishInterval () {
      if (!this.rest) {
        this.lastCompletedExerciseTime = Date.now()

        this.addCompletedExercise({
          workout: this.workout.id,
          exercise: this.currentExercise,
          completedTime: this.lastCompletedExerciseTime
        })

        this.rest = true
        this.countdown = interval
        this.timer = setInterval(this.decrementCountdown, 1000)

        if (this.lastExerciseOfWorkout) {
          this.done = true
          this.endTime = Date.now()
        } else {
          this.currentExerciseIndex++
          if (this.firstExerciseOfRound) {
            this.currentRound += 1
          }
        }
      } else {
        this.finishRest()
      }
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
