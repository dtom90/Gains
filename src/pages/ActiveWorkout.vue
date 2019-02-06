<template>
  <f7-page>
    <f7-navbar :title="'Active Workout: '+workout.name" back-link="Back"></f7-navbar>

    <f7-block strong>
      <h3>Active Workout: {{ workout.name }}</h3>
      <p>{{workout.exercises}} x {{workout.rounds}}</p>

      <f7-block>
        <h1>Current Round: {{ currentRound }}</h1>
        <h1>Current Exercise: {{ currentExercise }}</h1>
        <p>Time Remaining: {{ countdown }}</p>
      </f7-block>

      <f7-button v-if="!done" class="col" big fill raised color="green" @click="goToNextExercise">
        Next
      </f7-button>
      <h1 v-if="done">DONE!!!</h1>

    </f7-block>

  </f7-page>
</template>

<script>
const interval = 2;

export default {
  data: () => ({
    workout: {},
    currentExerciseIndex: 0,
    currentRound: 1,
    countdown: interval,
    timer: null,
    done: false
  }),
  created: function () {
    this.workout = this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0];
    this.timer = setInterval(this.decrementCountdown, 1000)
  },
  computed: {
    currentExercise() { return this.workout.exercises[this.currentExerciseIndex] },
  },
  methods: {

    goToNextExercise() {

      if (this.currentExerciseIndex === this.workout.exercises.length-1 &&
        this.currentRound === this.workout.rounds) {
        this.done = true
      } else {
        this.currentExerciseIndex = (this.currentExerciseIndex + 1) % this.workout.exercises.length;
        if (this.currentExerciseIndex === 0)
          this.currentRound += 1
      }
    },

    decrementCountdown() {
      if(this.countdown > 1) {
        this.countdown -= 1;
      } else {
        this.goToNextExercise();
        if (this.done) {
          this.countdown -= 1;
          clearInterval(this.timer);
        }
        else
          this.countdown = interval
      }
    }

  }
}
</script>
