<template>
  <f7-page id="active-workout">
    <!-- Navbar -->
    <f7-navbar
      :title="workout.name"
      large
      class="no-hairline no-shadow"
      inner-class="text-align-center"
    >
      <!-- Close Button -->
      <f7-link
        id="close-button"
        slot="left"
        :href="'/workout/'+workout.id"
        small
        round
      >
        <f7-icon material="close" />
      </f7-link>
    </f7-navbar>

    <!-- Toolbar -->
    <f7-toolbar
      v-show="portraitMode"
      bottom
      :inner="false"
      class="no-hairline no-shadow"
      style="height: auto"
    >
      <workout-progress
        :current-round="currentRound"
        :total-rounds="workout.rounds"
        :elapsed-workout-time="elapsedWorkoutTime"
        :workout-percentage="workoutPercentage"
      />
    </f7-toolbar>

    <f7-block>
      <!-- Finish Workout Button -->
      <div
        v-show="done && numbersEntered"
      >
        <f7-button
          :href="`/workout/${workout.id}`"
          class="col big-button"
          large
          fill
          raised
        >
          Finish Workout
        </f7-button>
      </div>

      <!-- Rest Panel -->
      <rest-panel
        v-if="rest && !done"
        v-show="numbersEntered"
        :rest-time="currentExercise.rest"
        :on-end-rest="onEndRest"
        :next-exercise-name="nextExercise.name"
      />

      <!-- Exercise Panel -->
      <exercise-panel
        :exercise="currentExercise"
        :rest="rest"
        :numbers-entered="numbersEntered"
        :on-end-set="onEndSet"
        :enter-numbers="enterNumbers"
      />

      <!-- Workout Progress (Landscape Mode) -->
      <workout-progress
        v-if="!portraitMode"
        :current-round="currentRound"
        :total-rounds="workout.rounds"
        :elapsed-workout-time="elapsedWorkoutTime"
        :workout-percentage="workoutPercentage"
      />
    </f7-block>
  </f7-page>
</template>

<script>
import { f7Page, f7Navbar, f7Link, f7Icon, f7Block, f7Toolbar, f7Button } from 'framework7-vue'
import { mapMutations } from 'vuex'
import ExercisePanel from '@/components/ExercisePanel.vue'
import RestPanel from '@/components/RestPanel.vue'
import WorkoutProgress from '../components/WorkoutProgress'

let deviceready = false
document.addEventListener('deviceready', function () {
  deviceready = true
})

export default {

  components: {
    WorkoutProgress,
    ExercisePanel,
    RestPanel,
    f7Page,
    f7Navbar,
    f7Link,
    f7Icon,
    f7Block,
    f7Toolbar,
    f7Button
  },

  data: () => ({
    portraitMode: true,
    workout: {},
    exerciseSequence: [],
    startTime: null,
    now: null,
    endTime: null,
    currentExerciseIndex: 0,
    currentRound: 1,
    lastCompletedSetTime: null,
    workoutTimer: null,
    rest: false,
    restCountdown: false,
    numbersEntered: false,
    done: false
  }),

  computed: {
    currentExercise () { return this.exerciseSequence[this.currentExerciseIndex] },
    nextExercise () { return this.exerciseSequence[this.currentExerciseIndex + 1] },
    workoutPercentage () { return Math.round((this.currentExerciseIndex + (this.rest ? 1 : 0)) / this.exerciseSequence.length * 100) },
    firstExerciseOfWorkout () { return this.currentRound === 1 && this.currentExerciseIndex === 0 },
    firstExerciseOfRound () { return this.currentExerciseIndex % this.workout.exercises.length === 0 },
    lastExerciseOfWorkout () { return this.currentExerciseIndex === this.exerciseSequence.length - 1 },
    completed () { return this.$store.state.completed },
    elapsedWorkoutTime () {
      const ms = (this.endTime || this.now) - this.startTime
      let secs = Math.round(ms / 1000)
      const mins = Math.floor(secs / 60)
      secs -= (mins * 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  },

  created: function () {
    this.workout = this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
    this.exerciseSequence = []
    for (let i = 0; i < this.workout.rounds; i++) {
      this.exerciseSequence.push(...this.workout.exercises)
    }
    this.startTime = Date.now()
    this.now = Date.now()
    this.workoutTimer = setInterval(this.incrementTimeElapsed, 1000)

    if (deviceready) {
      this.portraitMode = screen.orientation.type.includes('portrait')
      window.addEventListener('orientationchange', () => {
        this.portraitMode = screen.orientation.type.includes('portrait')
        if (!this.portraitMode) {
          document.querySelector('#active-workout > .page-content').scroll({
            top: 70,
            left: 0
          })
        }
      })
    }
  },

  methods: {

    ...mapMutations([
      'startActiveWorkout',
      'addCompletedSet'
    ]),

    // Handle completed set
    onEndSet () {
      // Record completed time of exercise
      this.lastCompletedSetTime = Date.now()

      // Mark that we're resting
      this.rest = true
      this.restCountdown = true

      // If this is the last exercise of the workout
      if (this.lastExerciseOfWorkout) {
        // Mark that we're done and record the end time of the workout
        this.done = true
        this.endTime = Date.now()
      }
    },

    enterNumbers (weight, reps) {
      // Initialize the workout record if this is the first exercise
      if (this.firstExerciseOfWorkout) {
        this.startActiveWorkout({
          workoutId: this.workout.id,
          startTime: this.startTime
        })
      }

      // Record completed set
      this.addCompletedSet({
        workoutId: this.workout.id,
        workoutStartTime: this.startTime,
        exerciseName: this.currentExercise.name,
        round: this.currentRound,
        weight,
        reps,
        completedTime: this.lastCompletedSetTime
      })
      this.numbersEntered = true
      if (!this.restCountdown) {
        this.startNextSet()
      }
    },

    onEndRest () {
      this.restCountdown = false
      if (this.numbersEntered) {
        this.startNextSet()
      }
    },

    incrementTimeElapsed () {
      if (this.done) {
        clearInterval(this.workoutTimer)
      } else {
        this.now = Date.now()
      }
    },

    startNextSet () {
      this.numbersEntered = false

      // Increment the currentExerciseIndex
      this.currentExerciseIndex++
      if (this.firstExerciseOfRound) {
        this.currentRound += 1
      }

      // End the rest
      this.rest = false
    }
  }
}
</script>

<style scoped>
  #active-workout {
    background-color: #0A1344
  }
</style>
