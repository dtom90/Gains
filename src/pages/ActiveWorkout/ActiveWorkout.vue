<template>
  <f7-page>
    <f7-navbar
      :title="'Active Workout: '+workout.name"
      back-link="Back"
    />

    <f7-block
      strong
    >
      <p>{{ firstExerciseOfRound && rest ? 'Next' : 'Current' }} Round: {{ currentRound }}</p>

      <rest-panel
        v-if="rest && !done"
        :countdown="countdown"
        :rest="rest"
        :finish-rest="finishRest"
      />

      <exercise-panel
        v-if="rest && !firstExerciseOfWorkout"
        :exercise="previousExercise"
        :rest="rest"
        :completed="true"
        :last-completed-exercise-time="lastCompletedExerciseTime"
      />

      <exercise-panel
        v-if="!done"
        :exercise="currentExercise"
        :rest="rest"
        :finish-exercise="finishExercise"
      />

      <rest-panel
        v-if="!rest && !done"
        :countdown="countdown"
        :rest="rest"
        :rest-time="restTime"
      />
    </f7-block>

    <f7-block
      v-if="done"
    >
      <p><strong>Total Workout Time:</strong> {{ totalWorkoutTime }}</p>
      <f7-button
        :href="`/workout/${workout.id}`"
        class="col"
        big
        fill
        raised
        color="green"
      >
        Finish Workout
      </f7-button>
    </f7-block>
  </f7-page>
</template>

<script>
import { f7Page, f7Navbar, f7Block, f7Button } from 'framework7-vue'
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
    f7Block,
    f7Button
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

    // Handle completed exercise
    finishExercise () {
      // Record completed time of exercise
      this.lastCompletedExerciseTime = Date.now()

      // Record completed exercise
      this.addCompletedExercise({
        workout: this.workout.id,
        exercise: this.currentExercise,
        completedTime: this.lastCompletedExerciseTime
      })

      // Mark that we're resting
      this.rest = true

      // If this is the last exercise of the workout
      if (this.lastExerciseOfWorkout) {
        // Mark that we're done and record the end time of the workout
        this.done = true
        this.endTime = Date.now()
      } else {
        // Otherwise, start the rest timer and start the countdown
        this.countdown = interval
        this.timer = setInterval(this.decrementCountdown, 1000)

        // Increment the currentExerciseIndex
        this.currentExerciseIndex++
        if (this.firstExerciseOfRound) {
          this.currentRound += 1
        }
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

  hours = hours > 0 ? hours + ' hours' : ''
  minutes = minutes > 0 ? minutes + ' minutes' : ''
  seconds = seconds + ' seconds'
  return hours + minutes + seconds
}
</script>
