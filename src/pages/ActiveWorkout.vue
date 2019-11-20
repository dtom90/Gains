<template>
  <f7-page style="background-color: #0A1344">
    <f7-button
      :href="'/workout/'+workout.id"
      small
      outline
      round
      color="red"
      style="color: red; width: 36px; height: 36px; font-size: 28px; margin: 12px;"
    >
      &times;
    </f7-button>
    <f7-block style="margin-top: 16px;">
      <div class="workout-name">
        {{ workout.name }}
      </div>

      <!-- Round Counter -->
      <div class="workout-round">
        Round {{ currentRound }} of {{ workout.rounds }}
      </div>

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

      <!-- Active Rest -->
      <rest-panel
        v-if="rest && !done"
        :countdown="countdown"
        :rest="rest"
        :finish-rest="finishRest"
      />

      <!-- Current / Next Exercise -->
      <exercise-panel
        v-if="!done"
        :exercise="rest ? nextExercise : currentExercise"
        :rest="rest"
        :finish-exercise="finishExercise"
      />
    </f7-block>

    <f7-block v-if="!done">
      <div class="time-elapsed">
        Time Elapsed: {{ elapsedWorkoutTime }}
      </div>
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
import { f7Page, f7Block, f7Button } from 'framework7-vue'
import { mapMutations } from 'vuex'
import ExercisePanel from '@/components/ExercisePanel.vue'
import RestPanel from '@/components/RestPanel.vue'
import humanizeDuration from 'humanize-duration'

export default {

  components: {
    ExercisePanel,
    RestPanel,
    f7Page,
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
    countdown: null,
    timer: null,
    started: false,
    rest: false,
    done: false
  }),

  computed: {
    currentExercise () { return this.exerciseSequence[this.currentExerciseIndex] },
    nextExercise () { return this.exerciseSequence[this.currentExerciseIndex + 1] },
    firstExerciseOfWorkout () { return this.currentRound === 0 && this.currentExerciseIndex === 0 },
    firstExerciseOfRound () { return this.currentExerciseIndex % this.workout.exercises.length === 0 },
    lastExerciseOfWorkout () { return this.currentExerciseIndex === this.exerciseSequence.length - 1 },
    completed () { return this.$store.state.completed },
    elapsedWorkoutTime () { return humanizeDuration(Date.now() - this.startTime, { round: true }) },
    totalWorkoutTime () { return humanizeDuration(this.endTime - this.startTime, { round: true }) }
  },

  created: function () {
    this.workout = this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
    this.exerciseSequence = []
    for (let i = 0; i < this.workout.rounds; i++) {
      this.exerciseSequence.push(...this.workout.exercises)
    }
    this.startTime = Date.now()
    this.startActiveWorkout({
      workoutId: this.workout.id,
      startTime: this.startTime
    })
  },

  methods: {

    ...mapMutations(['addCompletedExercise', 'startActiveWorkout']),

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
  .workout-name {
    font-size: 36px;
    font-weight: bold;
    text-align: center;
  }
  .workout-round {
    margin-top: 12px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
  .time-elapsed {
    font-weight: bold;
    font-size: 24px;
    text-align: center;
  }
</style>
