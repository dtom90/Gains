<template>
  <f7-page>
    <f7-navbar :title="'Active Workout: '+workout.name" back-link="Back"></f7-navbar>

    <f7-block strong>
      <p>{{ firstExercise && rest ? 'Next' : 'Current' }} Round: {{ currentRound }}</p>

      <rest-panel v-if="rest" :countdown="countdown" :rest="rest" :finishInterval="finishInterval"/>
      <exercise-panel :currentRound="currentRound" :currentExercise="currentExercise"
                      :rest="rest" :finishInterval="finishInterval"/>
      <rest-panel v-if="!rest" :countdown="countdown" :rest="rest" :finishInterval="finishInterval"/>

      <h1 v-if="done">DONE!!!</h1>

    </f7-block>

  </f7-page>
</template>

<script>
import ExercisePanel from './ActiveWorkout/ExercisePanel.vue';
import RestPanel from './ActiveWorkout/RestPanel.vue';

const interval = 10;

export default {

  components: {
    'exercise-panel': ExercisePanel,
    'rest-panel': RestPanel,
  },

  data: () => ({
    workout: {},
    currentExerciseIndex: 0,
    currentRound: 1,
    countdown: interval,
    timer: null,
    started: false,
    rest: false,
    done: false
  }),

  created: function () {
    this.workout = this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0];
  },

  computed: {
    currentExercise() { return this.workout.exercises[this.currentExerciseIndex] },
    firstExercise() { return this.currentExerciseIndex === 0 },
    lastExercise() { return this.currentExerciseIndex === this.workout.exercises.length-1 },
    lastRound() { return this.currentRound === this.workout.rounds }
  },

  methods: {

    finishInterval() {

      if(!this.rest) {

        this.rest = true;
        this.countdown = interval;
        this.timer = setInterval(this.decrementCountdown, 1000);

        if (this.lastExercise && this.lastRound) {
          this.done = true
        } else {
          this.currentExerciseIndex = (this.currentExerciseIndex + 1) % this.workout.exercises.length;
          if (this.currentExerciseIndex === 0)
            this.currentRound += 1
        }
      } else {
        this.finishRest();
      }
    },

    decrementCountdown() {
      if(this.countdown > 1) {
        this.countdown -= 1;
      } else {
        this.finishRest();
      }
    },

    finishRest() {
      this.countdown = 0;
      this.rest = false;
      clearInterval(this.timer);
    }

  }
}
</script>
