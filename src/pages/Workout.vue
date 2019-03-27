<template>
  <f7-page>
    <f7-navbar
      :title="'Workout: '+workout.name"
      back-link="Back"
    />

    <f7-block>
      <f7-block-title>
        Exercises:
      </f7-block-title>

      <f7-list>
        <f7-list-item
          v-for="(exercise, i) in workout.exercises"
          :key="i"
        >
          {{ exercise }}
        </f7-list-item>
      </f7-list>

      <f7-block-footer>
        <p>x {{ workout.rounds }} Round{{ workout.rounds === 1 ? '' : 's' }}</p>
      </f7-block-footer>
    </f7-block>
    <f7-block>
      <f7-button
        :href="`/workout/${workout.id}/go`"
        class="col"
        big
        fill
        raised
        color="green"
      >
        Start Workout
      </f7-button>
    </f7-block>
    <f7-block>
      <f7-block-title>
        Completed Exercises:
      </f7-block-title>
      <f7-list>
        <f7-list-item
          v-for="(exercise, i) in completedExercises"
          :key="i"
        >
          {{ exercise.exercise }} {{ exercise.reps && (': '+exercise.reps + ' reps') }}
        </f7-list-item>
      </f7-list>
    </f7-block>
  </f7-page>
</template>

<script>
import { f7Page, f7Navbar, f7Block, f7BlockTitle, f7List, f7BlockFooter, f7ListItem, f7Button } from 'framework7-vue'

export default {
  components: { f7Page, f7Navbar, f7Block, f7BlockTitle, f7BlockFooter, f7List, f7ListItem, f7Button },

  computed: {
    workout () {
      return this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
    },
    completedExercises () {
      return Object.values(this.$store.state.completed).filter(e => e.workout === this.workout.id)
    }
  }
}
</script>
