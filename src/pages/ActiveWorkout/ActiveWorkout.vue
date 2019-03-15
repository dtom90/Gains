<template>
  <f7-page>
    <f7-navbar :title="'Active Workout: '+workout.name" back-link="Back"></f7-navbar>

    <f7-block strong>

      <p>{{ firstExercise && rest ? 'Next' : 'Current' }} Round: {{ currentRound }}</p>

      <exercise-panel v-if="rest && !firstExercise" :exercise="previousExercise"
                      :rest="rest" :completed="true" :enterReps="enterReps"/>

      <rest-panel v-if="rest" :countdown="countdown" :rest="rest" :finishInterval="finishInterval"/>

      <exercise-panel :exercise="currentExercise" :rest="rest" :finishInterval="finishInterval"/>

      <rest-panel v-if="!rest" :countdown="countdown" :rest="rest" :restTime="restTime"/>

      <h1 v-if="done">DONE!!!</h1>

    </f7-block>

  </f7-page>
</template>

<script>
import { mapMutations } from 'vuex'
import ExercisePanel from './ExercisePanel.vue';
import RestPanel from './RestPanel.vue';

const interval = 30;

export default {

  components: {
    'exercise-panel': ExercisePanel,
    'rest-panel': RestPanel,
  },

  data: () => ({
    workout: {},
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

  created: function () {
    this.workout = this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0];
  },

  computed: {
    previousExercise() { return this.workout.exercises[this.currentExerciseIndex-1] },
    currentExercise() { return this.workout.exercises[this.currentExerciseIndex] },
    firstExercise() { return this.currentExerciseIndex === 0 },
    lastExerciseOfRound() { return this.currentExerciseIndex === this.workout.exercises.length-1 },
    lastRound() { return this.currentRound === this.workout.rounds },
    completed() { return this.$store.state.completed }
  },

  methods: {

    ...mapMutations(['addCompletedExercise', 'addCompletedReps']),

    finishInterval() {

      if(!this.rest) {

        this.lastCompletedExerciseTime = Date.now();
        this.addCompletedExercise({
          exercise: this.currentExercise,
          completedTime: this.lastCompletedExerciseTime
        });

        this.rest = true;
        this.countdown = interval;
        this.timer = setInterval(this.decrementCountdown, 1000);

        if (this.lastExerciseOfRound && this.lastRound) {
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

    enterReps(exercise, reps) {
      if (this.$store.state.completed[this.lastCompletedExerciseTime].exercise === exercise)
        this.addCompletedReps({time: this.lastCompletedExerciseTime, reps})
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
