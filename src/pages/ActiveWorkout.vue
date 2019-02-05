<template>
  <f7-page>
    <f7-navbar :title="'Active Workout: '+workout.name" back-link="Back"></f7-navbar>

    <f7-block strong>
      <h3>Active Workout: {{ workout.name }}</h3>

      <f7-block>
        <h1>Current Round: {{ currentRound }}</h1>
        <h1>Current Exercise: {{ currentExercise }}</h1>
        <h1>Next Exercise: {{ nextExercise }}</h1>
      </f7-block>

    </f7-block>

  </f7-page>
</template>

<script>
export default {
  data: () => ({
    workout: {},
    currentExerciseIndex: 0,
    currentRound: 1
  }),
  created: function () {
    this.workout = this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
  },
  computed: {
    currentExercise() { return this.workout.exercises[this.currentExerciseIndex] },
    nextExerciseIndex() {
      const lastExercise = this.currentExerciseIndex === this.workout.exercises.length-1;
      // const lastRound = this.currentRound === this.workout.rounds;
      return lastExercise ? 0 : this.currentExerciseIndex+1
    },
    nextExercise() { return this.workout.exercises[this.nextExerciseIndex] }
  }
}
</script>
