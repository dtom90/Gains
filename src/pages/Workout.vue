<template>
  <f7-page>
    <f7-navbar :title="'Workout: '+workout.name" back-link="Back"></f7-navbar>

    <f7-block>
    <f7-block-title>
      Exercises:
    </f7-block-title>

    <f7-list>
      <f7-list-item v-for="(exercise, i) in workout.exercises" :key="i">
        {{ exercise }}
      </f7-list-item>
    </f7-list>

    <f7-block-footer>
      <p>x {{ workout.rounds }} Round{{ workout.rounds === 1 ? '' : 's' }}</p>
    </f7-block-footer>

    </f7-block>
    <f7-block>
      <f7-button :href="`/workout/${workout.id}/go`"
                 class="col" big fill raised color="green">
        Start Workout
      </f7-button>
    </f7-block>

  </f7-page>
</template>

<script>
export default {
  computed: {
    workout () {
      return this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
    }
  }
}
</script>
