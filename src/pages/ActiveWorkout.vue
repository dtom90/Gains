<template>
  <f7-page id="active-workout">
    <f7-navbar
      class="no-hairline no-shadow"
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

      <!-- Workout Name -->
      <f7-nav-title-large id="workout-name">
        {{ workout.name }}
      </f7-nav-title-large>
    </f7-navbar>
    <f7-page-content>
      <f7-block style="margin-top: 12px;">
        <div class="display-flex">
          <!-- Round Counter -->
          <div id="workout-round">
            Round {{ currentRound }} of {{ workout.rounds }}
          </div>
          <!-- Time Elapsed -->
          <div id="time-elapsed">
            {{ elapsedWorkoutTime }}
          </div>
        </div>

        <!-- Finish Workout Button -->
        <div
          v-show="done && numbersEntered"
        >
          <f7-button
            :href="`/workout/${workout.id}`"
            class="col big-button"
            big
            fill
            raised
          >
            Finish Workout
          </f7-button>
        </div>

        <!-- Active Rest -->
        <rest-panel
          v-if="rest && !done"
          v-show="numbersEntered"
          :countdown="countdown"
          :rest="rest"
          :finish-rest="finishRest"
        />

        <!-- Completed Exercise -->
        <exercise-panel
          v-if="rest && !firstExerciseOfWorkout"
          :exercise="currentExercise"
          :rest="rest"
          :completed="true"
          :workout-id="workout.id"
          :workout-time="startTime"
          :last-completed-exercise-time="lastCompletedExerciseTime"
        />

        <!-- Current / Next Exercise -->
        <exercise-panel
          v-if="!rest && !done"
          :exercise="currentExercise"
          :rest="rest"
          :finish-exercise="finishExercise"
        />
      </f7-block>
    </f7-page-content>

    <f7-toolbar
      bottom
      :inner="false"
      class="no-hairline no-shadow"
      style="height: auto"
    >
      <f7-block style="margin-top: 8px;">
        <div id="progress-container">
          <span class="progress-text">Progress: {{ workoutPercentage }} %</span>
          <span
            class="progress-bar"
            :style="`width: ${workoutPercentage}%;`"
          />
        </div>
      </f7-block>
    </f7-toolbar>
  </f7-page>
</template>

<script>
import { f7Page, f7Navbar, f7NavTitleLarge, f7Link, f7Icon, f7PageContent, f7Block, f7Toolbar, f7Button } from 'framework7-vue'
import { mapState, mapMutations } from 'vuex'
import ExercisePanel from '@/components/ExercisePanel.vue'
import RestPanel from '@/components/RestPanel.vue'

export default {

  components: {
    ExercisePanel,
    RestPanel,
    f7Page,
    f7Navbar,
    f7NavTitleLarge,
    f7Link,
    f7Icon,
    f7PageContent,
    f7Block,
    f7Toolbar,
    f7Button
  },

  data: () => ({
    workout: {},
    exerciseSequence: [],
    startTime: null,
    now: null,
    endTime: null,
    currentExerciseIndex: 0,
    currentRound: 1,
    lastCompletedExerciseTime: null,
    workoutTimer: null,
    countdown: null,
    timer: null,
    started: false,
    rest: false,
    done: false
  }),

  computed: {
    ...mapState([
      'numbersEntered'
    ]),
    currentExercise () { return this.exerciseSequence[this.currentExerciseIndex] },
    nextExercise () { return this.exerciseSequence[this.currentExerciseIndex + 1] },
    workoutPercentage () { return Math.round((this.currentExerciseIndex + (this.rest ? 1 : 0)) / this.exerciseSequence.length * 100) },
    firstExerciseOfWorkout () { return this.currentRound === 0 && this.currentExerciseIndex === 0 },
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
    this.resetNumbersEntered()
    this.workout = this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
    this.exerciseSequence = []
    for (let i = 0; i < this.workout.rounds; i++) {
      this.exerciseSequence.push(...this.workout.exercises)
    }
    this.startTime = Date.now()
    this.now = Date.now()
    this.workoutTimer = setInterval(this.incrementTimeElapsed, 1000)
    this.startActiveWorkout({
      workoutId: this.workout.id,
      startTime: this.startTime
    })
  },

  methods: {

    ...mapMutations([
      'addCompletedExercise',
      'startActiveWorkout',
      'resetNumbersEntered'
    ]),

    // Handle completed exercise
    finishExercise () {
      // Record completed time of exercise
      this.lastCompletedExerciseTime = Date.now()

      // Record completed exercise
      this.addCompletedExercise({
        workoutId: this.workout.id,
        startTime: this.startTime,
        exercise: this.currentExercise,
        round: this.currentRound,
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
        this.countdown = this.currentExercise.rest
        this.timer = setInterval(this.decrementCountdown, 1000)
      }
    },

    incrementTimeElapsed () {
      if (this.done) {
        clearInterval(this.workoutTimer)
      } else {
        this.now = Date.now()
      }
    },

    // Countdown function during rest
    decrementCountdown () {
      if (this.countdown > 1) {
        this.countdown -= 1
      } else {
        this.clearCountdown()
      }
    },

    clearCountdown () {
      this.countdown = 0
      clearInterval(this.timer)
    },

    // Handle finished rest
    finishRest () {
      // Finish countdown, end rest flag, clear timer
      this.clearCountdown()
      this.rest = false

      // Increment the currentExerciseIndex
      this.currentExerciseIndex++
      if (this.firstExerciseOfRound) {
        this.currentRound += 1
      }
    }

  }
}
</script>

<style scoped>
  #active-workout {
    background-color: #0A1344
  }
  #workout-name {
    text-align: center;
  }
  #workout-round {
    font-size: 24px;
    font-weight: bold;
  }
  #time-elapsed {
    flex: 1;
    text-align: right;
    font-weight: bold;
    font-size: 24px;
  }
  #progress-container {
    background-color: #A6A6A6;
    margin-top: 10px;
    border-radius: 5px;
    position: relative;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
  }
  .progress-bar {
    background-color: #27AE60;
    position: absolute;
    left: 0;
    height: 100%;
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
  }
  .progress-text {
    position: relative;
    z-index: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
</style>
